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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

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

    @Scheduled(fixedRate = 60000) // 1분마다 실행
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
            BigDecimal curPrice = ticker[0].getPrice();
            executeTrade(user, portfolioOption, tradingOption, curPrice);
        }
    }

    // 매매 조건을 검토하고 거래를 실행하는 메서드
    public void executeTrade(User user, PortfolioOption portfolioOption, TradingOption tradingOption, BigDecimal curPrice) {
        System.out.println("매매 조건을 검토하고 거래를 실행합니다...");

        BigDecimal curRate = backTestingCalculator.calculateRate(tradingOption.getCurrentCapital(), tradingOption.getInitialCapital(), curPrice, tradingOption.getCoinCount());
        String action = backTestingCalculator.determineAction(curPrice, tradingOption.getAvgPrice(), tradingOption.getTradingCount(), tradingOption.getBuyingCount(), portfolioOption.getBuyingPoint(), portfolioOption.getSellingPoint(), portfolioOption.getStopLossPoint(), curRate);
        UpbitKey upbitKey = upbitKeyRepository.findByUser(user);
        if (Objects.isNull(upbitKey)) {
            throw new UserException(UserErrorResult.NOT_FOUND_KEY);
        }
        String token = jwtUtil.generateUpbitToken(upbitKey);

        // 매수 처리
        if (action.equals("BUY")) {
            BigDecimal numCoins = curPrice.divide(tradingOption.getTradingUnitPrice());
            UpbitDto.OrderRequest orderRequest = UpbitDto.OrderRequest.of(BIT_COIN_MARKET_NAME, "bid", numCoins, curPrice, "limit");
            executeBuy(action, token, orderRequest);

        }
        // 익절 처리
        else if (action.equals("SELL")) {
            UpbitDto.OrderRequest orderRequest = UpbitDto.OrderRequest.of(BIT_COIN_MARKET_NAME, "ask", tradingOption.getCoinCount(), curPrice, "limit");
            executeSell(action, token, orderRequest);
        }
        // 손절 처리
        else if (action.equals("STOP_LOSS")) {
            UpbitDto.OrderRequest orderRequest = UpbitDto.OrderRequest.of(BIT_COIN_MARKET_NAME, "ask", tradingOption.getCoinCount(), curPrice, "limit");
            executeStopLoss(action, token, orderRequest);
        }
    }

    // 매수 처리 메서드
    private void executeBuy(String action, String token, UpbitDto.OrderRequest orderRequest) {
        upbitApiClient.createNewOrder(UPBIT_URL_ORDER, token, orderRequest);
    }

    // 익절 처리 메서드
    private void executeSell(String action, String token, UpbitDto.OrderRequest orderRequest) {
        upbitApiClient.createNewOrder(UPBIT_URL_ORDER, token, orderRequest);
    }

    // 손절 처리 메서드
    private void executeStopLoss(String action, String token, UpbitDto.OrderRequest orderRequest) {
        upbitApiClient.createNewOrder(UPBIT_URL_ORDER, token, orderRequest);
    }
}