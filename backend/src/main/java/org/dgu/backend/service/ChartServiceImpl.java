package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.dgu.backend.dto.ChartDto;
import org.dgu.backend.exception.ChartErrorResult;
import org.dgu.backend.exception.ChartException;
import org.dgu.backend.repository.CandleInfoRepository;
import org.dgu.backend.repository.CandleRepository;
import org.dgu.backend.repository.MarketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ChartServiceImpl implements ChartService {
    private final MarketRepository marketRepository;
    private final CandleRepository candleRepository;
    private final CandleInfoRepository candleInfoRepository;

    private static final List<String> SEVEN_DAY_CANDLES = Arrays.asList("minutes1", "minutes3", "minutes5", "minutes10", "minutes15", "minutes30");
    private static final List<String> SIX_MONTH_CANDLES = Arrays.asList("minutes60", "minutes240");

    // OHLCV 차트를 반환하는 메서드
    @Override
    public List<ChartDto.OHLCVResponse> getOHLCVCharts(String koreanName, String candleName) {
        Market market = marketRepository.findByKoreanName(koreanName);
        Candle candle = candleRepository.findByCandleName(candleName);

        LocalDateTime startDate = getStartDateByCandleName(candleName);

        List<CandleInfo> candleInfos = candleInfoRepository.findByMarketAndCandleAndDateTimeAfter(market, candle, startDate);
        if (candleInfos.isEmpty()) {
            throw new ChartException(ChartErrorResult.NOT_FOUND_CHARTS);
        }
        return candleInfos.stream()
                .map(ChartDto.OHLCVResponse::of)
                .collect(Collectors.toList());
    }

    // 캔들 종류에 따라 시작 기간을 계산해 반환하는 메서드
    private LocalDateTime getStartDateByCandleName(String candleName) {
        LocalDateTime now = LocalDateTime.now();
        if (SEVEN_DAY_CANDLES.contains(candleName)) {
            return now.minusDays(7);
        } else if (SIX_MONTH_CANDLES.contains(candleName)) {
            return now.minusMonths(6);
        } else {
            return LocalDateTime.of(2019, 1, 1, 0, 0);
        }
    }
}