package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.common.constant.Coin;
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
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DashBoardServiceImpl implements DashBoardService {
    private final RestTemplate restTemplate;
    private final JwtUtil jwtUtil;
    private final UpbitKeyRepository upbitKeyRepository;
    private final UserCoinRepository userCoinRepository;

    // 유저 업비트 잔고를 반환하는 메서드
    @Override
    public DashBoardDto.UserAccountResponse getUserAccount(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        UpbitKey upbitKey = upbitKeyRepository.findByUser(user);

        String token = jwtUtil.generateUpbitToken(upbitKey.getAccessKey(), upbitKey.getSecretKey());
        String url = "https://api.upbit.com/v1/accounts";
        UpbitDto.Account[] responseBody = getUserAccountsAtUpbit(url, token);
        if (Objects.isNull(responseBody)) {
            throw new UpbitException(UpbitErrorResult.FAIL_ACCESS_USER_ACCOUNT);
        }

        long accountSum = 0L;
        for (UpbitDto.Account account : responseBody) {
            if (account.getCurrency().equals("KRW")) {
                accountSum += BigDecimal.valueOf(account.getBalance()).longValue();
            } else {
                accountSum += BigDecimal.valueOf(account.getBalance())
                        .multiply(BigDecimal.valueOf(account.getAvgBuyPrice()))
                        .longValue();
            }
        }

        return DashBoardDto.UserAccountResponse.builder()
                .account(accountSum)
                .build();
    }

    // 유저 보유 코인 목록을 반환하는 메서드
    @Override
    public List<DashBoardDto.UserCoinResponse> getUserCoins(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        UpbitKey upbitKey = upbitKeyRepository.findByUser(user);

        String token = jwtUtil.generateUpbitToken(upbitKey.getAccessKey(), upbitKey.getSecretKey());
        String url = "https://api.upbit.com/v1/accounts";
        UpbitDto.Account[] responseBody = getUserAccountsAtUpbit(url, token);
        if (Objects.isNull(responseBody)) {
            throw new UpbitException(UpbitErrorResult.FAIL_ACCESS_USER_ACCOUNT);
        }

        List<DashBoardDto.UserCoinResponse> userCoinResponses = new ArrayList<>();
        for (UpbitDto.Account account : responseBody) {
            String coinName = account.getCurrency();
            if (coinName.equals("KRW")) {
                continue;
            }

            UserCoin userCoin = userCoinRepository.findByCoinName(account.getCurrency());
            boolean isIncrease = false;
            if (!Objects.isNull(userCoin)) {
                isIncrease = isBalanceIncreased(account, userCoin);
                userCoinRepository.delete(userCoin);
            }

            DashBoardDto.UserCoinResponse userCoinResponse = DashBoardDto.UserCoinResponse.builder()
                    .coinName(coinName)
                    .balance(BigDecimal.valueOf(account.getBalance()))
                    .price(BigDecimal.valueOf(account.getAvgBuyPrice()))
                    .isIncrease(isIncrease)
                    .build();
            userCoinResponses.add(userCoinResponse);

            userCoinRepository.save(userCoinResponse.to(user));
        }

        return userCoinResponses;
    }

    // 대표 코인 5개 정보를 반환하는 메서드
    @Override
    public List<DashBoardDto.RepresentativeCoinResponse> getRepresentativeCoins() {
        String url = "https://api.upbit.com/v1/ticker?markets=";
        List<DashBoardDto.RepresentativeCoinResponse> representativeCoinResponses = new ArrayList<>();
        for (Coin coin : Coin.values()) {
            UpbitDto.Ticker[] responseBody = getTickerPriceAtUpbit(url + coin.getMarketName());
            if (Objects.isNull(responseBody[0])) {
                throw new UpbitException(UpbitErrorResult.FAIL_ACCESS_COIN_INFO);
            }
            representativeCoinResponses.add(DashBoardDto.RepresentativeCoinResponse.of(responseBody[0], coin.getKoreanName()));
        }

        return representativeCoinResponses;
    }

    // 코인 가격 상승 여부를 판단하는 메서드
    private boolean isBalanceIncreased(UpbitDto.Account account, UserCoin userCoin) {
        BigDecimal curBalance = BigDecimal.valueOf(account.getBalance())
                .multiply(BigDecimal.valueOf(account.getAvgBuyPrice()));

        return curBalance.compareTo(userCoin.getBalance()) > 0;
    }

    // 전체 계좌 조회 업비트 API와 통신하는 메서드
    private UpbitDto.Account[] getUserAccountsAtUpbit(String url, String token) {
        String authenticationToken = "Bearer " + token;
        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", MediaType.APPLICATION_JSON_VALUE);
        headers.add("Authorization", authenticationToken);
        ResponseEntity<UpbitDto.Account[]> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                UpbitDto.Account[].class
        );

        return responseEntity.getBody();
    }

    // 시세 현재가 조회 업비트 API와 통신하는 메서드
    private UpbitDto.Ticker[] getTickerPriceAtUpbit(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", MediaType.APPLICATION_JSON_VALUE);
        ResponseEntity<UpbitDto.Ticker[]> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                UpbitDto.Ticker[].class
        );

        return responseEntity.getBody();
    }
}