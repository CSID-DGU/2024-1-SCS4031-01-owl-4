package org.dgu.backend.repository;

import org.dgu.backend.domain.TradingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TradingResultRepository extends JpaRepository<TradingResult,Long> {
}