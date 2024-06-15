package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.repository.CandleInfoRepository;
import org.dgu.backend.repository.CandleRepository;
import org.dgu.backend.repository.MarketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class CandleInfoServiceImpl implements CandleInfoService {
    @Value("${upbit.url.candle-minute}")
    private String UPBIT_URL_CANDLE_MINUTE;
    @Value("${upbit.url.candle-etc}")
    private String UPBIT_URL_CANDLE_ETC;
    private final CandleInfoRepository candleInfoRepository;
    private final MarketRepository marketRepository;
    private final CandleRepository candleRepository;
    private final UpbitApiClient upbitApiClient;

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
            url = String.format(UPBIT_URL_CANDLE_MINUTE, candleName.substring(0,7), unit, marketName, count);
        } else {
            // 그 외 (일봉, 주봉, 월봉)
            url = String.format(UPBIT_URL_CANDLE_ETC, candleName, marketName, count);
        }

        if (!Objects.isNull(to)) {
            // 마지막 캔들 시각도 지정한 경우
            String formattedTo = to.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"));
            url += ("&to=" + formattedTo);
        }

        UpbitDto.CandleInfoResponse[] responseBody = upbitApiClient.getCandleInfoAtUpbit(url);
        for (UpbitDto.CandleInfoResponse candleInfoResponse : responseBody) {
            CandleInfo candleInfo = CandleInfo.toEntity(candleInfoResponse, market, candle);
            candleInfoRepository.save(candleInfo);
        }
    }
}