package org.dgu.backend.repository;

import org.dgu.backend.domain.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketRepository extends JpaRepository<Market,Long> {

}