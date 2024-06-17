package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.*;
import org.dgu.backend.dto.TradingDto;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.*;
import org.dgu.backend.repository.*;
import org.dgu.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TradingServiceImpl implements TradingService {
    private static final double FEE_RATE = 0.0005;
    private static final String BIT_COIN_MARKET_NAME = "KRW-BTC";
    private final JwtUtil jwtUtil;
    private final UpbitApiClient upbitApiClient;
    private final BackTestingCalculator backTestingCalculator;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioOptionRepository portfolioOptionRepository;
    private final TradingOptionRepository tradingOptionRepository;
    private final UpbitKeyRepository upbitKeyRepository;
    private final UserTradingLogRepository userTradingLogRepository;
    private final OrderService orderService;

    // 자동매매 등록 메서드
    @Override
    public void registerAutoTrading(String authorizationHeader, TradingDto.AutoTradingRequest autoTradingRequest) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        validateUser(user);

        Portfolio portfolio = portfolioRepository.findByPortfolioId(autoTradingRequest.getPortfolioId())
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));
        validatePortfolio(portfolio);

        PortfolioOption portfolioOption = portfolioOptionRepository.findByPortfolio(portfolio)
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO_OPTIONS));

        if (autoTradingRequest.getFund() / portfolioOption.getTradingUnit() < 5000) {
            throw new TradingException(TradingErrorResult.BELOW_MINIMUM_PURCHASE_AMOUNT);
        }

        deleteExistingTradingOptionIfExist(user);

        portfolio.startTrade();
        portfolioRepository.save(portfolio);
        TradingOption tradingOption = autoTradingRequest.to(user, portfolio, portfolioOption);
        tradingOptionRepository.save(tradingOption);
    }

    // 자동매매 삭제 메서드
    @Override
    public void removeAutoTrading(String authorizationHeader, String portfolioId) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        validateUser(user);

        Portfolio portfolio = portfolioRepository.findByPortfolioId(UUID.fromString(portfolioId))
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));
        if (!portfolio.getIsTrade()) {
            throw new TradingException(TradingErrorResult.IS_NOT_TRADE_PORTFOLIO);
        }

        TradingOption existingTradingOption = tradingOptionRepository.findByUser(user);
        cancelAutoTrading(portfolio);
        tradingOptionRepository.deleteTradingOptionById(existingTradingOption.getId());
    }
    // 거래 실행 메서드
    @Override
    public void executeTrade(User user, PortfolioOption portfolioOption, TradingOption tradingOption, Double curPrice) throws UpbitException, UserException {
        System.out.println("매매 조건을 검토하고 거래를 실행합니다...");
        Double avgPrice;
        BigDecimal coinCount;
        UpbitDto.Account bitAccount = getAvgPriceAndCoinCount(user);
        boolean firstTrading = false;
        if (Objects.isNull(bitAccount)) {
            avgPrice = curPrice;
            tradingOption.updateAvgPrice(avgPrice);
            tradingOptionRepository.save(tradingOption);
            coinCount = BigDecimal.ZERO;
            firstTrading = true;
        } else {
            avgPrice = bitAccount.getAvgBuyPrice();
            coinCount = bitAccount.getCoinCount();
        }
        Long currentCapital = tradingOption.getCurrentCapital();
        Double curRate = backTestingCalculator.calculateRate(currentCapital, tradingOption.getInitialCapital(), curPrice, coinCount);
        String action = backTestingCalculator.determineAction(curPrice, avgPrice, tradingOption.getTradingCount(), tradingOption.getBuyingCount(), portfolioOption.getBuyingPoint(), portfolioOption.getSellingPoint(), portfolioOption.getStopLossPoint(), curRate);
        if (firstTrading) {
            action = "BUY";
        }
        UpbitKey upbitKey = upbitKeyRepository.findByUser(user);
        if (Objects.isNull(upbitKey)) {
            throw new UserException(UserErrorResult.NOT_FOUND_KEY);
        }

        switch (action) {
            case "BUY":
                executeBuy(tradingOption, upbitKey, curPrice, user);
                addTradingLog(user, action, tradingOption, curPrice, 0.0);
                break;
            case "SELL":
            case "STOP_LOSS":
                executeSell(tradingOption, upbitKey, curPrice, coinCount);
                // rate 계산하는 부분 추가 예정
                addTradingLog(user, action, tradingOption, curPrice, curRate);
                break;
            default:
                System.out.println("매매 조건에 맞는 액션이 없습니다.");
                break;
        }
    }

    // 매수 실행 메서드
    private void executeBuy(TradingOption tradingOption, UpbitKey upbitKey, Double curPrice, User user) {
        System.out.println("매수를 진행합니다...");

        // 1회당 매수 금액으로 매수 진행
        Long tradingUnitPrice = tradingOption.getTradingUnitPrice();
        Map<String, String> params = createParams(BIT_COIN_MARKET_NAME, "bid", null, tradingUnitPrice, "price");
        orderService.executeOrder(params, upbitKey);

        // 구매한 금액만큼 소비하고 구매 횟수++
        Long consume = calculatePurchaseAmount(tradingUnitPrice);
        tradingOption.updateCurrentCapital(tradingOption.getCurrentCapital() - consume);
        tradingOption.plusBuyingCount();

        // 코인 업데이트
        updateCoinCount(tradingOption, curPrice);

        // 평단가 업데이트
        updateAveragePrice(tradingOption, curPrice, user);

        tradingOptionRepository.save(tradingOption);
    }

    // 매수 금액 계산 메서드
    private Long calculatePurchaseAmount(Long tradingUnitPrice) {
        return (long) (tradingUnitPrice + (tradingUnitPrice * FEE_RATE));
    }

    // 코인 업데이트 메서드
    private void updateCoinCount(TradingOption tradingOption, Double curPrice) {
        BigDecimal newCoinCount = tradingOption.getCoinCount().add(BigDecimal.valueOf(tradingOption.getTradingUnitPrice() / curPrice));
        tradingOption.updateCoinCount(newCoinCount);
    }

    // 평단가 업데이트 메서드
    private void updateAveragePrice(TradingOption tradingOption, Double curPrice, User user) {
        List<UserTradingLog> userTradingLogs = userTradingLogRepository.findRecentLogsAfterLastSell(user);
        List<Double> coinPrices = userTradingLogs.stream()
                .map(UserTradingLog::getCoinPrice)
                .collect(Collectors.toList());

        coinPrices.add(curPrice);
        double newAvgPrice = coinPrices.stream().mapToDouble(Double::doubleValue).sum() / tradingOption.getBuyingCount();
        tradingOption.updateAvgPrice(newAvgPrice);
    }

    // 매도 실행 메서드
    private void executeSell(TradingOption tradingOption, UpbitKey upbitKey, Double curPrice, BigDecimal coinCount) {
        System.out.println("매도를 진행합니다...");
        // 보유한 코인 일괄 판매
        Map<String, String> params = createParams(BIT_COIN_MARKET_NAME, "ask", coinCount, null, "market");
        orderService.executeOrder(params, upbitKey);

        Long income = coinCount.multiply(BigDecimal.valueOf(curPrice)).longValue();
        Long finalCapital = tradingOption.getCurrentCapital() + income;
        tradingOption.updateCurrentCapital(finalCapital);
        tradingOption.updateInitialCapital(finalCapital);
        tradingOption.updateCoinCount(BigDecimal.ZERO);
        tradingOption.resetBuyingCount();
        tradingOptionRepository.save(tradingOption);
    }

    // 유저 거래 로그 추가 메서드
    private void addTradingLog(User user, String type, TradingOption tradingOption, Double curPrice, Double rate) {
        UserTradingLog userTradingLog = UserTradingLog.builder()
                .user(user)
                .type(type)
                .capital(tradingOption.getCurrentCapital())
                .coin(tradingOption.getCoinCount())
                .coinPrice(curPrice)
                .rate(rate)
                .build();
        userTradingLogRepository.save(userTradingLog);
    }

    // 파라미터 생성 메서드
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

    // 비트코인 자산 정보 반환 메서드
    private UpbitDto.Account getAvgPriceAndCoinCount(User user) {
        UpbitDto.Account[] accounts = upbitApiClient.getUpbitAccounts(user);
        for (UpbitDto.Account account : accounts) {
            if (account.getCurrency().equals("BTC")) {
                return account;
            }
        }

        return null;
    }

    // 기존 거래 옵션 제거 메서드
    private void deleteExistingTradingOptionIfExist(User user) {
        TradingOption existingTradingOption = tradingOptionRepository.findByUser(user);
        if (!Objects.isNull(existingTradingOption)) {
            // 기존 자동매매 등록 취소 처리
            Portfolio existPortfolio = existingTradingOption.getPortfolio();
            cancelAutoTrading(existPortfolio);
            tradingOptionRepository.deleteTradingOptionById(existingTradingOption.getId());
        }
    }

    // 거래 중지 메서드
    private void cancelAutoTrading(Portfolio portfolio) {
        portfolio.stopTrade();
        portfolioRepository.saveAndFlush(portfolio);
    }

    // 유저 유효성 검증 메서드
    private void validateUser(User user) {
        if (!user.getIsAgree()) {
            throw new TradingException(TradingErrorResult.IS_NOT_AGREED_USER);
        }
        if (Objects.isNull(user.getUpbitKey())) {
            throw new TradingException(TradingErrorResult.HAS_NOT_UPBIT_KEY);
        }
    }

    // 포트폴리오 유효성 검증 메서드
    private void validatePortfolio(Portfolio portfolio) {
        if (!portfolio.getIsSaved()) {
            throw new TradingException(TradingErrorResult.IS_NOT_SAVED_PORTFOLIO);
        }
        if (portfolio.getIsTrade()) {
            throw new TradingException(TradingErrorResult.IS_ALREADY_TRADING);
        }
    }
}