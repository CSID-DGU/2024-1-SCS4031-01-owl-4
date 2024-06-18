package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.PortfolioOption;
import org.dgu.backend.domain.TradingOption;
import org.dgu.backend.domain.User;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.PortfolioErrorResult;
import org.dgu.backend.exception.PortfolioException;
import org.dgu.backend.repository.PortfolioOptionRepository;
import org.dgu.backend.repository.TradingOptionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class UpbitAutoTrader {
    private static final String BIT_COIN_MARKET_NAME = "KRW-BTC";
    @Value("${upbit.url.ticker}")
    private String UPBIT_URL_TICKER;
    private final UpbitApiClient upbitApiClient;
    private final TradingService tradingService;
    private final TradingOptionRepository tradingOptionRepository;
    private final PortfolioOptionRepository portfolioOptionRepository;

    // 자동매매 진행 메서드
    //@Scheduled(fixedRate = 5000) // 5초마다 실행
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
            // 평단가가 없으면 현재 가격으로 초기화
            if (Objects.isNull(tradingOption.getAvgPrice())) {
                tradingOption.updateAvgPrice(curPrice);
                tradingOptionRepository.save(tradingOption);
            }
            tradingService.executeTrade(user, portfolioOption, tradingOption, curPrice);

            System.out.println("현재 보유 잔고 : " + tradingOption.getCurrentCapital() + "원");
            System.out.println("현재 평단가 : " + tradingOption.getAvgPrice().longValue() + "원");
            System.out.println("현재 보유 코인 : " + tradingOption.getCoinCount() + "개");
            System.out.println("현재 구매 횟수 : " + tradingOption.getBuyingCount() + "회");
        }
    }
}