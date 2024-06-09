package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.dgu.backend.repository.CandleInfoRepository;
import org.dgu.backend.repository.CandleRepository;
import org.dgu.backend.repository.MarketRepository;
import org.dgu.backend.util.CandleDataCollector;
import org.dgu.backend.util.CandleUtil;
import org.dgu.backend.util.DateUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class CandleInfoUpdater {
    private final MarketRepository marketRepository;
    private final CandleRepository candleRepository;
    private final CandleInfoRepository candleInfoRepository;
    private final CandleDataCollector candleDataCollector;
    private final CandleUtil candleUtil;
    private final DateUtil dateUtil;

    // 현재 시각을 기준으로 캔들 정보를 최신화하는 메서드
    public void ensureCandleInfoUpToDate(String koreanName, String candleName) {
        Market market = marketRepository.findByKoreanName(koreanName);
        Candle candle = candleRepository.findByCandleName(candleName);

        // 가장 최근 캔들 차트
        CandleInfo latestCandleInfo = candleInfoRepository.findTopByMarketAndCandleOrderByTimestampDesc(market, candle);
        int candleInterval = candleUtil.calculateCandleInterval(candleName);
        LocalDateTime startDate;
        if (Objects.isNull(latestCandleInfo)) {
            startDate = dateUtil.convertToLocalDateTime("2019-01-01T00:00:00");
        } else {
            startDate = latestCandleInfo.getDateTime();
            if (startDate.plusMinutes(candleInterval).isAfter(LocalDateTime.now())) {
                return;
            }
        }

        candleDataCollector.collectCandleData(koreanName, candleName, startDate, LocalDateTime.now());
    }
}