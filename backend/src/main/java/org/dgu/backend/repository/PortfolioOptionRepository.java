package org.dgu.backend.repository;

import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.PortfolioOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioOptionRepository extends JpaRepository<PortfolioOption,Long> {
    PortfolioOption findByPortfolio(Portfolio portfolio);
}