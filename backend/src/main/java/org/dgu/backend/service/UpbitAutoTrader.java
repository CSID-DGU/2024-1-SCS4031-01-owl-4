package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.*;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.PortfolioErrorResult;
import org.dgu.backend.exception.PortfolioException;
import org.dgu.backend.exception.UserErrorResult;
import org.dgu.backend.exception.UserException;
import org.dgu.backend.repository.PortfolioOptionRepository;
import org.dgu.backend.repository.TradingOptionRepository;
import org.dgu.backend.repository.UpbitKeyRepository;
import org.dgu.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class UpbitAutoTrader {
    private static final String BIT_COIN_MARKET_NAME = "KRW-BTC";
    @Value("${upbit.url.ticker}")
    private String UPBIT_URL_TICKER;
    @Value("${upbit.url.order}")
    private String UPBIT_URL_ORDER;
    private final UpbitApiClient upbitApiClient;
    private final JwtUtil jwtUtil;
    private final BackTestingCalculator backTestingCalculator;
    private final TradingOptionRepository tradingOptionRepository;
    private final PortfolioOptionRepository portfolioOptionRepository;
    private final UpbitKeyRepository upbitKeyRepository;

    //@Scheduled(fixedRate = 6000) // 1분마다 실행
    public void performAutoTrading() {
        System.out.println("자동매매 로직 실행 중...");

        List<TradingOption> tradingOptions = tradingOptionRepository.findAll();
        for (TradingOption tradingOption : tradingOptions) {
            User user = tradingOption.getUser();
            Portfolio portfolio = tradingOption.getPortfolio();
            PortfolioOption portfolioOption = portfolioOptionRepository.findByPortfolio(portfolio)
                    .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO_OPTIONS));
            // 현재가 조회
            UpbitDto.Ticker[] ticker = upbitApiClient.getTickerPriceAtUpbit(UPBIT_URL_TICKER + BIT_COIN_MARKET_NAME);
            Double curPrice = ticker[0].getPrice().doubleValue();
            if (Objects.isNull(tradingOption.getAvgPrice())) {
                tradingOption.updateAvgPrice(curPrice);
                tradingOptionRepository.save(tradingOption);
            }
            executeTrade(user, portfolioOption, tradingOption, curPrice);
        }
    }

    // 매매 조건을 검토하고 거래를 실행하는 메서드
    public void executeTrade(User user, PortfolioOption portfolioOption, TradingOption tradingOption, Double curPrice) {
        System.out.println("매매 조건을 검토하고 거래를 실행합니다...");

        Double curRate = backTestingCalculator.calculateRate(tradingOption.getCurrentCapital(), tradingOption.getInitialCapital(), curPrice, tradingOption.getCoinCount());
        String action = backTestingCalculator.determineAction(curPrice, tradingOption.getAvgPrice(), tradingOption.getTradingCount(), tradingOption.getBuyingCount(), portfolioOption.getBuyingPoint(), portfolioOption.getSellingPoint(), portfolioOption.getStopLossPoint(), curRate);
        UpbitKey upbitKey = upbitKeyRepository.findByUser(user);
        if (Objects.isNull(upbitKey)) {
            throw new UserException(UserErrorResult.NOT_FOUND_KEY);
        }

        Map<String, String> params;
        try {
            switch (action) {
                case "BUY":
                    params = createParams(BIT_COIN_MARKET_NAME, "bid", null, tradingOption.getTradingUnitPrice(), "price");
                    executeOrder(params, upbitKey);
                    break;
                case "SELL":
                case "STOP_LOSS":
                    params = createParams(BIT_COIN_MARKET_NAME, "ask", tradingOption.getCoinCount(), null, "market");
                    executeOrder(params, upbitKey);
                    break;
                default:
                    System.out.println("매매 조건에 맞는 액션이 없습니다.");
                    break;
            }
        } catch (RuntimeException e) {
            System.err.println("주문 생성 실패: " + e.getMessage());
        }
    }

    // 주문 생성 및 실행 메서드
    private void executeOrder(Map<String, String> params, UpbitKey upbitKey) {
        String queryString = buildQueryString(params);
        String queryHash = generateQueryHash(queryString);
        String authenticationToken = jwtUtil.generateUpbitOrderToken(upbitKey, queryHash);
        upbitApiClient.createNewOrder(UPBIT_URL_ORDER, authenticationToken, params);
    }

    // 파라미터 생성
    public Map<String, String> createParams(String market, String side, BigDecimal volume, Long price, String ordType) {
        Map<String, String> params = new HashMap<>();
        params.put("market", market);
        params.put("side", side);
        if (!Objects.isNull(volume)) {
            params.put("volume", volume.toString());
        }
        if (!Objects.isNull(price)) {
            params.put("price", price.toString());
        }
        params.put("ord_type", ordType);

        return params;
    }

    // 쿼리 문자열 생성
    private static String buildQueryString(Map<String, String> params) {
        List<String> queryElements = new ArrayList<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            queryElements.add(entry.getKey() + "=" + entry.getValue());
        }
        return String.join("&", queryElements);
    }

    // 쿼리 해시 생성
    private static String generateQueryHash(String queryString) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.update(queryString.getBytes("UTF-8"));
            byte[] hashBytes = md.digest();
            return String.format("%0128x", new BigInteger(1, hashBytes));
        } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
            throw new RuntimeException("SHA-512 해시 생성 실패: " + e.getMessage(), e);
        }
    }
}