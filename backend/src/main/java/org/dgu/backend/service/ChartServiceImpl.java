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
import org.dgu.backend.util.CandleUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChartServiceImpl implements ChartService {
    private final MarketRepository marketRepository;
    private final CandleRepository candleRepository;
    private final CandleInfoRepository candleInfoRepository;
    private final CandleInfoUpdater candleInfoUpdater;
    private final CandleUtil candleUtil;

    // OHLCV 차트를 반환하는 메서드
    @Override
    public List<ChartDto.OHLCVResponse> getOHLCVCharts(String koreanName, String candleName) {
        updateCandleInfo(koreanName, candleName);

        return fetchUpdatedCandleInfo(koreanName, candleName);
    }

    // 차트 선택 지표 목록을 반환하는 메서드
    @Override
    public List<ChartDto.ChartOptionResponse> getAllChartOptions() {
        List<Market> markets = marketRepository.findAll();
        List<Candle> candles = candleRepository.findAll();

        return markets.stream()
                .flatMap(market -> candles.stream()
                        .map(candle -> ChartDto.ChartOptionResponse.of(market, candle)))
                .collect(Collectors.toList());
    }

    // 캔들 정보 최신화 메서드
    @Transactional
    protected void updateCandleInfo(String koreanName, String candleName) {
        candleInfoUpdater.ensureCandleInfoUpToDate(koreanName, candleName);
    }

    // 최신화된 캔들 정보를 반환하는 메서드
    @Transactional
    protected List<ChartDto.OHLCVResponse> fetchUpdatedCandleInfo(String koreanName, String candleName) {
        Market market = marketRepository.findByKoreanName(koreanName);
        Candle candle = candleRepository.findByCandleName(candleName);
        LocalDateTime startDate = candleUtil.getStartDateByCandleName(candleName);

        List<CandleInfo> candleInfos = candleInfoRepository.findByMarketAndCandleAndDateTimeAfter(market, candle, startDate);
        if (candleInfos.isEmpty()) {
            throw new ChartException(ChartErrorResult.NOT_FOUND_CHARTS);
        }
        candleInfos = candleUtil.removeDuplicatedCandles(candleInfos);

        return candleInfos.stream()
                .map(ChartDto.OHLCVResponse::of)
                .collect(Collectors.toList());
    }
}
