package org.dgu.backend.repository;

import org.dgu.backend.domain.Candle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandleRepository extends JpaRepository<Candle,Long> {
    Candle findByName(String candleName);
}