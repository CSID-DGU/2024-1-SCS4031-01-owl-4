package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.dgu.backend.dto.ChartDto;
import org.dgu.backend.exception.*;
import org.dgu.backend.repository.CandleInfoRepository;
import org.dgu.backend.repository.CandleRepository;
import org.dgu.backend.repository.MarketRepository;
import org.dgu.backend.util.CandleUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
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
    public List<ChartDto.OHLCVResponse> getOHLCVCharts(String koreanName, String candleName, LocalDateTime startDate) {
        updateCandleInfo(koreanName, candleName, startDate);

        return fetchUpdatedCandleInfo(koreanName, candleName, startDate);
    }

    // 차트 선택 지표 목록을 반환하는 메서드
    @Override
    public List<ChartDto.ChartOptionResponse> getAllChartOptions() {
        List<Market> markets = marketRepository.findAll();
        if (markets.isEmpty()) {
            throw new MarketException(MarketErrorResult.NOT_FOUND_MARKETS);
        }
        List<Candle> candles = candleRepository.findAll();
        if (candles.isEmpty()) {
            throw new CandleException(CandleErrorResult.NOT_FOUND_CANDLES);
        }

        return markets.stream()
                .flatMap(market -> candles.stream()
                        .map(candle -> ChartDto.ChartOptionResponse.of(market, candle)))
                .collect(Collectors.toList());
    }

    // 캔들 정보 최신화 메서드
    @Transactional
    protected void updateCandleInfo(String koreanName, String candleName, LocalDateTime startDate) {
        candleInfoUpdater.ensureCandleInfoUpToDate(koreanName, candleName, startDate);
    }

    // 최신화된 캔들 정보를 반환하는 메서드
    @Transactional
    protected List<ChartDto.OHLCVResponse> fetchUpdatedCandleInfo(String koreanName, String candleName, LocalDateTime startDate) {
        Market market = marketRepository.findByKoreanName(koreanName);
        if (Objects.isNull(market)) {
            throw new MarketException(MarketErrorResult.NOT_FOUND_MARKET);
        }
        Candle candle = candleRepository.findByCandleName(candleName);
        if (Objects.isNull(candle)) {
            throw new CandleException(CandleErrorResult.NOT_FOUND_CANDLE);
        }
        if (Objects.isNull(startDate)) {
            startDate = candleUtil.getStartDateByCandleName(candleName);
        }

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
