package org.dgu.backend.repository;

import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio,Long> {
    Optional<Portfolio> findByPortfolioId(UUID portfolioId);
    @Query("SELECT p FROM Portfolio p WHERE p.user = :user AND p.isSaved = 1")
    List<Portfolio> findAllSavedByUser(User user);
    Optional<Portfolio> findByUserAndPortfolioId(User user, UUID portfolioId);
}