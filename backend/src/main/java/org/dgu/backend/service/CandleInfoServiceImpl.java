package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.dgu.backend.dto.response.CandleInfoResponse;
import org.dgu.backend.repository.CandleInfoRepository;
import org.dgu.backend.repository.MarketRepository;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandleInfoServiceImpl implements CandleInfoService {

    private final CandleInfoRepository candleInfoRepository;
    private final MarketRepository marketRepository;
    private final RestTemplate restTemplate;

    // 캔들의 데이터를 가져와 저장하는 메서드
    @Override
    public void getCandleInfo(String marketKoreanName, LocalDateTime to, int count) {
        Market market = marketRepository.findByKoreanName(marketKoreanName);
        String marketName = market.getName();

        String url = String.format("https://api.upbit.com/v1/candles/days?market=%s&count=%d", marketName, count);
        if (to != null) {
            String formattedTo = to.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"));
            url += ("&to=" + formattedTo);
        }

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
                CandleInfo candleInfo = CandleInfo.toEntity(market, candleInfoResponse);
                candleInfoRepository.save(candleInfo);
            }
        } else {
            log.error("Failed to receive candle info");
        }
    }
}