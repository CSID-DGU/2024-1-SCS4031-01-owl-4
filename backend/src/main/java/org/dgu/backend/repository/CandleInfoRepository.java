package org.dgu.backend.repository;

import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface CandleInfoRepository extends JpaRepository<CandleInfo,Long> {
    @Query("SELECT c FROM CandleInfo c WHERE c.candle = :candle AND c.dateTime BETWEEN :startDate AND :endDate ORDER BY c.dateTime")
    List<CandleInfo> findFilteredCandleInfo(Candle candle, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT c FROM CandleInfo c WHERE c.market = :market AND c.candle = :candle AND c.dateTime > :startDate ORDER BY c.dateTime")
    List<CandleInfo> findByMarketAndCandleAndDateTimeAfter(Market market, Candle candle, LocalDateTime startDate);
}