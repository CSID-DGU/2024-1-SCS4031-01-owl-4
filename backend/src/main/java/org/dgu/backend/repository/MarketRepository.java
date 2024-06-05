package org.dgu.backend.repository;

import org.dgu.backend.domain.Market;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketRepository extends JpaRepository<Market,Long> {
    Market findByKoreanName(String marketKoreanName);
}