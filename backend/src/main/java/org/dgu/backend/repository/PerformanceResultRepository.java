package org.dgu.backend.repository;

import org.dgu.backend.domain.PerformanceResult;
import org.dgu.backend.domain.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerformanceResultRepository extends JpaRepository<PerformanceResult,Long> {
    PerformanceResult findByPortfolio(Portfolio portfolio);
}