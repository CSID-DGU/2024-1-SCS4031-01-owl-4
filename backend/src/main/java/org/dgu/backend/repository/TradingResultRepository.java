package org.dgu.backend.repository;

import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.TradingResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TradingResultRepository extends JpaRepository<TradingResult,Long> {
    TradingResult findByPortfolio(Portfolio portfolio);
}