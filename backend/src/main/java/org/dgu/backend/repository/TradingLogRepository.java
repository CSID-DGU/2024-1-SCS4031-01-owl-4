package org.dgu.backend.repository;

import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.TradingLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TradingLogRepository extends JpaRepository<TradingLog,Long> {
    List<TradingLog> findAllByPortfolio(Optional<Portfolio> portfolio);
}