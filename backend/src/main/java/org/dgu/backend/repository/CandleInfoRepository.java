package org.dgu.backend.repository;

import org.dgu.backend.domain.CandleInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandleInfoRepository extends JpaRepository<CandleInfo,Long> {
    List<CandleInfo> findAllByCandleId(Long candleId);
}