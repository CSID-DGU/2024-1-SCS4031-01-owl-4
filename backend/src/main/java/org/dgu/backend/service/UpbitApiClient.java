package org.dgu.backend.service;

import com.nimbusds.jose.shaded.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.UpbitErrorResult;
import org.dgu.backend.exception.UpbitException;
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
    private final RestTemplate restTemplate;

    // HTTP GET 요청을 보내고 결과를 처리하는 메서드
    private <T> T sendHttpGetRequest(String url, Class<T> responseType, Optional<String> token) {
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
            if (Objects.isNull(responseEntity.getBody())) {
                throw new UpbitException(UpbitErrorResult.FAIL_GET_RESPONSE);
            }
            return responseEntity.getBody();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED && e.getResponseBodyAsString().contains("no_authorization_ip")) {
                throw new UpbitException(UpbitErrorResult.UNAUTHORIZED_IP);
            } else {
                throw new UpbitException(UpbitErrorResult.UNAUTHORIZED_KEY);
            }
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
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED && e.getResponseBodyAsString().contains("no_authorization_ip")) {
                throw new UpbitException(UpbitErrorResult.UNAUTHORIZED_IP);
            } else {
                throw new UpbitException(UpbitErrorResult.UNAUTHORIZED_KEY);
            }
        }
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
    public UpbitDto.OrderResponse[] createNewOrder(String url, String token, Map<String, String> params) {
        return sendHttpPostRequest(url, UpbitDto.OrderResponse[].class, token, params);
    }
}