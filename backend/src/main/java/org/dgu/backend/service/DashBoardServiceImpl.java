package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.constant.Coin;
import org.dgu.backend.domain.Market;
import org.dgu.backend.domain.User;
import org.dgu.backend.domain.UserCoin;
import org.dgu.backend.dto.DashBoardDto;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.MarketErrorResult;
import org.dgu.backend.exception.MarketException;
import org.dgu.backend.repository.MarketRepository;
import org.dgu.backend.repository.UserCoinRepository;
import org.dgu.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DashBoardServiceImpl implements DashBoardService {
    @Value("${upbit.url.ticker}")
    private String UPBIT_URL_TICKER;
    private final JwtUtil jwtUtil;
    private final UpbitApiClient upbitApiClient;
    private final UserCoinRepository userCoinRepository;
    private final MarketRepository marketRepository;

    // 유저 업비트 잔고를 반환하는 메서드
    @Override
    public DashBoardDto.UserAccountResponse getUserAccount(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        UpbitDto.Account[] accounts = upbitApiClient.getUpbitAccounts(user);

        BigDecimal accountSum = getAccountSum(accounts);

        return DashBoardDto.UserAccountResponse.builder()
                .account(accountSum.setScale(3, RoundingMode.HALF_UP))
                .build();
    }

    // 유저 보유 코인 목록을 반환하는 메서드
    @Override
    public List<DashBoardDto.UserCoinResponse> getUserCoins(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        UpbitDto.Account[] accounts = upbitApiClient.getUpbitAccounts(user);

        return processUserCoins(accounts, user);
    }

    // 유저 보유 코인을 처리하는 메서드
    private List<DashBoardDto.UserCoinResponse> processUserCoins(UpbitDto.Account[] accounts, User user) {
        List<DashBoardDto.UserCoinResponse> userCoinResponses = new ArrayList<>();
        for (UpbitDto.Account account : accounts) {
            String marketName = account.getCurrency();
            // 현금은 제외
            if (!marketName.equals("KRW")) {
                userCoinResponses.add(processSingleCoin(account, user, marketName));
            }
        }
        return userCoinResponses;
    }

    // 단일 코인 정보를 처리하는 메서드
    private DashBoardDto.UserCoinResponse processSingleCoin(UpbitDto.Account account, User user, String marketName) {
        marketName = "KRW-" + marketName;
        UserCoin userCoin = userCoinRepository.findByMarketName(marketName);
        Market market = marketRepository.findByMarketName(marketName);
        if (Objects.isNull(market)) {
            throw new MarketException(MarketErrorResult.NOT_FOUND_MARKET);
        }
        UpbitDto.Ticker[] ticker = upbitApiClient.getTickerPriceAtUpbit(UPBIT_URL_TICKER + marketName);
        BigDecimal curPrice = ticker[0].getPrice();
        BigDecimal curCoinCount = account.getCoinCount();
        boolean isIncrease = false;
        BigDecimal rate = BigDecimal.ZERO;
        if (!Objects.isNull(userCoin)) {
            rate = getCoinPriceIncreaseRate(userCoin, curPrice, curCoinCount);
            isIncrease = rate.compareTo(BigDecimal.ZERO) > 0;
            userCoinRepository.delete(userCoin);
        }

        DashBoardDto.UserCoinResponse userCoinResponse = DashBoardDto.UserCoinResponse.builder()
                .marketName(marketName)
                .koreanName(market.getKoreanName())
                .englishName(market.getEnglishName())
                .coinCount(curCoinCount)
                .price(curPrice)
                .balance(curPrice.multiply(curCoinCount).setScale(4, RoundingMode.HALF_UP))
                .isIncrease(isIncrease)
                .rate(rate)
                .build();

        userCoinRepository.save(userCoinResponse.to(user));
        return userCoinResponse;
    }

    // 대표 코인 5개 정보를 반환하는 메서드
    @Override
    public List<DashBoardDto.RepresentativeCoinResponse> getRepresentativeCoins() {
        List<DashBoardDto.RepresentativeCoinResponse> representativeCoinResponses = new ArrayList<>();
        int requestCount = 0;

        for (Coin coin : Coin.values()) {
            UpbitDto.Ticker[] ticker = upbitApiClient.getTickerPriceAtUpbit(UPBIT_URL_TICKER + coin.getMarketName());
            representativeCoinResponses.add(DashBoardDto.RepresentativeCoinResponse.of(ticker[0], coin.getKoreanName(), coin.getEnglishName()));

            requestCount++;
            if (requestCount % 10 == 0) {
                try {
                    Thread.sleep(1000); // 1초 대기
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException(e);
                }
            }
        }

        return representativeCoinResponses;
    }

    // 현재 업비트 잔고를 계산하는 메서드
    private BigDecimal getAccountSum(UpbitDto.Account[] accounts) {
        BigDecimal accountSum = BigDecimal.ZERO;
        for (UpbitDto.Account account : accounts) {
            if (account.getCurrency().equals("KRW")) {
                accountSum = accountSum.add(account.getCoinCount());
            } else {
                // 현재가를 가져옴
                String marketName = "KRW-" + account.getCurrency();
                UpbitDto.Ticker[] ticker = upbitApiClient.getTickerPriceAtUpbit(UPBIT_URL_TICKER + marketName);
                BigDecimal curPrice = ticker[0].getPrice();
                BigDecimal userCoinCount = account.getCoinCount();
                accountSum = accountSum.add(curPrice.multiply(userCoinCount));
            }
        }
        return accountSum;
    }

    // 기존 대비 코인 가격 상승률을 계산하는 메서드
    private BigDecimal getCoinPriceIncreaseRate(UserCoin userCoin, BigDecimal curPrice, BigDecimal curCoinCount) {
        BigDecimal pastValue = userCoin.getPrice().multiply(userCoin.getCoinCount());
        BigDecimal currentValue = curPrice.multiply(curCoinCount);

        return currentValue.subtract(pastValue)
                .divide(pastValue, 6, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
    }
}