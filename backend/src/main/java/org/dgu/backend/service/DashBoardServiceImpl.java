package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.constant.Coin;
import org.dgu.backend.domain.UpbitKey;
import org.dgu.backend.domain.User;
import org.dgu.backend.domain.UserCoin;
import org.dgu.backend.dto.DashBoardDto;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.UpbitErrorResult;
import org.dgu.backend.exception.UpbitException;
import org.dgu.backend.repository.UpbitKeyRepository;
import org.dgu.backend.repository.UserCoinRepository;
import org.dgu.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

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
    @Value("${upbit.url.account}")
    private String UPBIT_URL_ACCOUNT;
    @Value("${upbit.url.ticker}")
    private String UPBIT_URL_TICKER;
    private final RestTemplate restTemplate;
    private final JwtUtil jwtUtil;
    private final UpbitKeyRepository upbitKeyRepository;
    private final UserCoinRepository userCoinRepository;

    // 유저 업비트 잔고를 반환하는 메서드
    @Override
    public DashBoardDto.UserAccountResponse getUserAccount(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        UpbitDto.Account[] accounts = getUpbitAccounts(user);

        BigDecimal accountSum = getAccountSum(accounts);

        return DashBoardDto.UserAccountResponse.builder()
                .account(accountSum.setScale(3, RoundingMode.HALF_UP))
                .build();
    }

    // 유저 보유 코인 목록을 반환하는 메서드
    @Override
    public List<DashBoardDto.UserCoinResponse> getUserCoins(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        UpbitDto.Account[] accounts = getUpbitAccounts(user);

        return processUserCoins(accounts, user);
    }

    // 유저 보유 코인을 처리하는 메서드
    private List<DashBoardDto.UserCoinResponse> processUserCoins(UpbitDto.Account[] accounts, User user) {
        List<DashBoardDto.UserCoinResponse> userCoinResponses = new ArrayList<>();
        for (UpbitDto.Account account : accounts) {
            String coinName = account.getCurrency();
            // 현금은 제외
            if (!coinName.equals("KRW")) {
                userCoinResponses.add(processSingleCoin(account, user, coinName));
            }
        }
        return userCoinResponses;
    }

    // 단일 코인 정보를 처리하는 메서드
    private DashBoardDto.UserCoinResponse processSingleCoin(UpbitDto.Account account, User user, String coinName) {
        coinName = "KRW-" + coinName;
        UserCoin userCoin = userCoinRepository.findByCoinName(coinName);
        UpbitDto.Ticker[] ticker = getTickerPriceAtUpbit(UPBIT_URL_TICKER + coinName);
        BigDecimal curPrice = BigDecimal.valueOf(ticker[0].getPrice());
        BigDecimal curCoinCount = account.getCoinCount();
        boolean isIncrease = false;
        BigDecimal rate = BigDecimal.ZERO;
        if (!Objects.isNull(userCoin)) {
            rate = getCoinPriceIncreaseRate(userCoin, curPrice, curCoinCount);
            isIncrease = rate.compareTo(BigDecimal.ZERO) > 0;
            userCoinRepository.delete(userCoin);
        }

        DashBoardDto.UserCoinResponse userCoinResponse = DashBoardDto.UserCoinResponse.builder()
                .coinName(coinName)
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
        for (Coin coin : Coin.values()) {
            UpbitDto.Ticker[] ticker = getTickerPriceAtUpbit(UPBIT_URL_TICKER + coin.getMarketName());
            representativeCoinResponses.add(DashBoardDto.RepresentativeCoinResponse.of(ticker[0], coin.getKoreanName()));
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
                String coinName = "KRW-" + account.getCurrency();
                UpbitDto.Ticker[] ticker = getTickerPriceAtUpbit(UPBIT_URL_TICKER + coinName);
                BigDecimal curPrice = BigDecimal.valueOf(ticker[0].getPrice());
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

    // 유저 업비트 계좌 정보를 조회하는 메서드
    private UpbitDto.Account[] getUpbitAccounts(User user) {
        UpbitKey upbitKey = upbitKeyRepository.findByUser(user);
        if (Objects.isNull(upbitKey)) {
            throw new UpbitException(UpbitErrorResult.NOT_FOUND_UPBIT_KEY);
        }

        String token = jwtUtil.generateUpbitToken(upbitKey);
        UpbitDto.Account[] responseBody = getUserAccountsAtUpbit(UPBIT_URL_ACCOUNT, token);
        if (Objects.isNull(responseBody)) {
            throw new UpbitException(UpbitErrorResult.FAIL_ACCESS_USER_ACCOUNT);
        }
        return responseBody;
    }

    // 전체 계좌 조회 업비트 API와 통신하는 메서드
    private UpbitDto.Account[] getUserAccountsAtUpbit(String url, String token) {
        String authenticationToken = "Bearer " + token;
        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", MediaType.APPLICATION_JSON_VALUE);
        headers.add("Authorization", authenticationToken);

        try {
            ResponseEntity<UpbitDto.Account[]> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    UpbitDto.Account[].class
            );
            return responseEntity.getBody();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED && e.getResponseBodyAsString().contains("no_authorization_ip")) {
                throw new UpbitException(UpbitErrorResult.UNAUTHORIZED_IP);
            } else {
                throw new UpbitException(UpbitErrorResult.UNAUTHORIZED_UPBIT_KEY);
            }
        }
    }

    // 시세 현재가 조회 업비트 API와 통신하는 메서드
    private UpbitDto.Ticker[] getTickerPriceAtUpbit(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", MediaType.APPLICATION_JSON_VALUE);

        try {
            ResponseEntity<UpbitDto.Ticker[]> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    UpbitDto.Ticker[].class
            );
            if (Objects.isNull(responseEntity.getBody()[0])) {
                throw new UpbitException(UpbitErrorResult.FAIL_ACCESS_COIN_INFO);
            }
            return responseEntity.getBody();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED && e.getResponseBodyAsString().contains("no_authorization_ip")) {
                throw new UpbitException(UpbitErrorResult.UNAUTHORIZED_IP);
            } else {
                throw new UpbitException(UpbitErrorResult.UNAUTHORIZED_UPBIT_KEY);
            }
        }
    }
}