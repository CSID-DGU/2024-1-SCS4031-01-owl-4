package org.dgu.backend.repository;

import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.PortfolioOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PortfolioOptionRepository extends JpaRepository<PortfolioOption,Long> {
    Optional<PortfolioOption> findByPortfolio(Portfolio portfolio);
}