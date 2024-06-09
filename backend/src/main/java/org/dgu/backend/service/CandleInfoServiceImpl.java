package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.UpbitErrorResult;
import org.dgu.backend.exception.UpbitException;
import org.dgu.backend.repository.CandleInfoRepository;
import org.dgu.backend.repository.CandleRepository;
import org.dgu.backend.repository.MarketRepository;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
@RequiredArgsConstructor
public class CandleInfoServiceImpl implements CandleInfoService {

    private final CandleInfoRepository candleInfoRepository;
    private final MarketRepository marketRepository;
    private final CandleRepository candleRepository;
    private final RestTemplate restTemplate;

    // 업비트 API를 통해 캔들 정보를 가져오는 메서드
    @Override
    public void getCandleInfo(String koreanName, LocalDateTime to, int count, String candleName) {
        Market market = marketRepository.findByKoreanName(koreanName);
        Candle candle = candleRepository.findByCandleName(candleName);
        String marketName = market.getMarketName();

        String url;
        if (candleName.startsWith("minutes")) {
            // 분봉인 경우
            int unit = Integer.parseInt(candleName.substring(7));
            url = String.format("https://api.upbit.com/v1/candles/%s/%d?market=%s&count=%d", candleName.substring(0,7), unit, marketName, count);
        } else {
            // 그 외 (일봉, 주봉, 월봉)
            url = String.format("https://api.upbit.com/v1/candles/%s?market=%s&count=%d", candleName, marketName, count);
        }

        if (to != null) {
            // 마지막 캔들 시각도 지정한 경우
            String formattedTo = to.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"));
            url += ("&to=" + formattedTo);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", MediaType.APPLICATION_JSON_VALUE);

        ResponseEntity<UpbitDto.CandleInfoResponse[]> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                UpbitDto.CandleInfoResponse[].class
        );

        UpbitDto.CandleInfoResponse[] responseBody = responseEntity.getBody();
        if (responseBody != null) {
            for (UpbitDto.CandleInfoResponse candleInfoResponse : responseBody) {
                CandleInfo candleInfo = CandleInfo.toEntity(candleInfoResponse, market, candle);
                candleInfoRepository.save(candleInfo);
            }
        } else {
            throw new UpbitException(UpbitErrorResult.FAIL_GET_CANDLE_INFO);
        }
    }
}