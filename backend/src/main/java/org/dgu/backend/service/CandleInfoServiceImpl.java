package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.dgu.backend.dto.response.CandleInfoResponse;
import org.dgu.backend.repository.CandleInfoRepository;
import org.dgu.backend.repository.CandleRepository;
import org.dgu.backend.repository.MarketRepository;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandleInfoServiceImpl implements CandleInfoService {

    private final CandleInfoRepository candleInfoRepository;
    private final MarketRepository marketRepository;
    private final CandleRepository candleRepository;
    private final RestTemplate restTemplate;

    @Override
    public void getCandleInfo(String marketKoreanName, LocalDateTime to, int count, String candleType) {
        Market market = marketRepository.findByKoreanName(marketKoreanName);
        Candle candle = candleRepository.findByName(candleType);
        String marketName = market.getName();

        String url;
        if (candleType.startsWith("minutes")) {
            // 분봉인 경우
            int unit = Integer.parseInt(candleType.substring(7));
            url = String.format("https://api.upbit.com/v1/candles/%s/%d?market=%s&count=%d", candleType.substring(0,7), unit, marketName, count);
        } else {
            // 그 외 (일봉, 주봉, 월봉)
            url = String.format("https://api.upbit.com/v1/candles/%s?market=%s&count=%d", candleType, marketName, count);
        }

        if (to != null) {
            // 마지막 캔들 시각도 지정한 경우
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
                CandleInfo candleInfo = CandleInfo.toEntity(candleInfoResponse, market, candle);
                candleInfoRepository.save(candleInfo);
            }
        } else {
            log.error("Failed to receive candle info");
        }
    }
}