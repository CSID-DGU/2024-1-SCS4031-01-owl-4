package org.dgu.backend.repository;

import org.dgu.backend.domain.Candle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandleRepository extends JpaRepository<Candle,Long> {
    Candle findByName(String candleName);
}