package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.dto.response.CandleInfoResponse;
import org.dgu.backend.repository.CandleInfoRepository;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandleInfoServiceImpl implements CandleInfoService {

    private final CandleInfoRepository candleInfoRepository;
    private final RestTemplate restTemplate;

    @Override
    @Transactional
    public void getCandleInfo() {

        String url = "https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200";

        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", MediaType.APPLICATION_JSON_VALUE);

        ResponseEntity<CandleInfoResponse[]> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                CandleInfoResponse[].class
        );

        CandleInfoResponse[] responseBody = responseEntity.getBody();
        if (responseBody != null) {
            for (CandleInfoResponse candleInfoResponse : responseBody) {
                CandleInfo candleInfo = CandleInfo.toEntity(candleInfoResponse);
                candleInfoRepository.save(candleInfo);
            }
        } else {
            log.error("Failed to receive candle info");
        }
    }
}