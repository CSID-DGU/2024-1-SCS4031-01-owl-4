package org.dgu.backend.service;

import com.nimbusds.jose.shaded.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.UpbitKey;
import org.dgu.backend.domain.User;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.UpbitErrorResult;
import org.dgu.backend.exception.UpbitException;
import org.dgu.backend.exception.UserErrorResult;
import org.dgu.backend.exception.UserException;
import org.dgu.backend.repository.UpbitKeyRepository;
import org.dgu.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UpbitApiClient {
    @Value("${upbit.url.account}")
    private String UPBIT_URL_ACCOUNT;
    private final RestTemplate restTemplate;
    private final JwtUtil jwtUtil;
    private final UpbitKeyRepository upbitKeyRepository;

    // HTTP GET 요청을 보내고 결과를 처리하는 메서드
    public <T> T sendHttpGetRequest(String url, Class<T> responseType, Optional<String> token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", MediaType.APPLICATION_JSON_VALUE);
        token.ifPresent(t -> headers.add("Authorization", "Bearer " + t));

        try {
            ResponseEntity<T> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    responseType
            );

            // HTTP 요청이 성공적으로 처리되었지만, 응답 본문이 null인 경우 예외 처리
            if (Objects.isNull(responseEntity.getBody())) {
                throw new UpbitException(UpbitErrorResult.FAIL_GET_RESPONSE);
            }

            return responseEntity.getBody();
        } catch (HttpClientErrorException e) {
            UpbitErrorResult errorResult = mapToUpbitErrorResult((HttpStatus) e.getStatusCode(), e.getResponseBodyAsString());
            throw new UpbitException(errorResult);
        }
    }

    // HTTP POST 주문 요청을 보내고 결과를 처리하는 메서드
    private <T> T sendHttpPostRequest(String url, Class<T> responseType, String token, Map<String, String> params) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);
        headers.set("Authorization", "Bearer " + token);

        try {
            ResponseEntity<T> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(new Gson().toJson(params), headers),
                    responseType
            );
            if (Objects.isNull(responseEntity.getBody())) {
                throw new UpbitException(UpbitErrorResult.FAIL_GET_RESPONSE);
            }
            return responseEntity.getBody();
        } catch (HttpClientErrorException e) {
            UpbitErrorResult errorResult = mapToUpbitErrorResult((HttpStatus) e.getStatusCode(), e.getResponseBodyAsString());
            throw new UpbitException(errorResult);
        }
    }

    // 유저 업비트 계좌 정보를 조회하는 메서드
    public UpbitDto.Account[] getUpbitAccounts(User user) {
        UpbitKey upbitKey = upbitKeyRepository.findByUser(user);
        if (Objects.isNull(upbitKey)) {
            throw new UserException(UserErrorResult.NOT_FOUND_KEY);
        }

        String token = jwtUtil.generateUpbitToken(upbitKey);
        return getUserAccountsAtUpbit(UPBIT_URL_ACCOUNT, token);
    }

    // 캔들 차트 조회 업비트 API와 통신하는 메서드
    public UpbitDto.CandleInfoResponse[] getCandleInfoAtUpbit(String url) {
        return sendHttpGetRequest(url, UpbitDto.CandleInfoResponse[].class, Optional.empty());
    }

    // 가상화폐 조회 업비트 API와 통신하는 메서드
    public UpbitDto.MarketResponse[] getAllMarketsAtUpbit(String url) {
        return sendHttpGetRequest(url, UpbitDto.MarketResponse[].class, Optional.empty());
    }

    // 전체 계좌 조회 업비트 API와 통신하는 메서드
    public UpbitDto.Account[] getUserAccountsAtUpbit(String url, String token) {
        return sendHttpGetRequest(url, UpbitDto.Account[].class, Optional.of(token));
    }

    // 시세 현재가 조회 업비트 API와 통신하는 메서드
    public UpbitDto.Ticker[] getTickerPriceAtUpbit(String url) {
        return sendHttpGetRequest(url, UpbitDto.Ticker[].class, Optional.empty());
    }

    // 주문 생성 업비트 API와 통신하는 메서드
    public UpbitDto.OrderResponse createNewOrder(String url, String token, Map<String, String> params) {
        return sendHttpPostRequest(url, UpbitDto.OrderResponse.class, token, params);
    }
    // HTTP 상태 코드에 따라 UpbitErrorResult를 반환하거나 에러 코드를 출력하는 메서드
    private UpbitErrorResult mapToUpbitErrorResult(HttpStatus statusCode, String responseBody) {
        for (UpbitErrorResult errorResult : UpbitErrorResult.values()) {
            if (errorResult.getHttpStatus() == statusCode && responseBody.contains(errorResult.getCode())) {
                return errorResult;
            }
        }

        // 그 외의 경우, 에러 코드만 출력
        System.out.println("Upbit error code: " + statusCode.toString() + " " + responseBody);
        return null;
    }
}