package org.dgu.backend.repository;

import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CandleInfoRepository extends JpaRepository<CandleInfo,Long> {
    @Query("SELECT c FROM CandleInfo c WHERE c.candle = :candle AND c.dateTime BETWEEN :startDate AND :endDate ORDER BY c.dateTime")
    List<CandleInfo> findFilteredCandleInfo(Candle candle, LocalDateTime startDate, LocalDateTime endDate);
}