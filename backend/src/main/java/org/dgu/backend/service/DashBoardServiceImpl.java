package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.domain.UpbitKey;
import org.dgu.backend.domain.User;
import org.dgu.backend.dto.DashBoardDto;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.UpbitErrorResult;
import org.dgu.backend.exception.UpbitException;
import org.dgu.backend.repository.UpbitKeyRepository;
import org.dgu.backend.util.JwtUtil;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DashBoardServiceImpl implements DashBoardService {
    private final RestTemplate restTemplate;
    private final JwtUtil jwtUtil;
    private final UpbitKeyRepository upbitKeyRepository;

    // 유저 업비트 잔고를 반환하는 메서드
    @Override
    public DashBoardDto.UserAccountResponse getUserAccount(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        UpbitKey upbitKey = upbitKeyRepository.findByUser(user);

        String token = jwtUtil.generateUpbitToken(upbitKey.getAccessKey(), upbitKey.getSecretKey());
        String url = "https://api.upbit.com/v1/accounts";
        UpbitDto.Account[] responseBody = connectUpbitApi(url, token);
        if (Objects.isNull(responseBody)) {
            throw new UpbitException(UpbitErrorResult.FAIL_ACCESS_USER_ACCOUNT);
        }

        long accountSum = 0L;
        for (UpbitDto.Account account : responseBody) {
            if (account.getCurrency().equals("KRW")) {
                accountSum += account.getBalance();
            } else {
                accountSum += (long) (account.getBalance() * account.getAvgBuyPrice());
            }
        }

        return DashBoardDto.UserAccountResponse.builder()
                .account(accountSum)
                .build();
    }

    // 업비트 API와 통신하는 메서드
    private UpbitDto.Account[] connectUpbitApi(String url, String token) {
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
}