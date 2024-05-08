package org.dgu.backend.repository;

import org.dgu.backend.domain.PortfolioResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioResultRepository extends JpaRepository<PortfolioResult,Long> {
}