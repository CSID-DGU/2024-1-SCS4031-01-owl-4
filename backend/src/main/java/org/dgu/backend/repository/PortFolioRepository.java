package org.dgu.backend.repository;

import org.dgu.backend.domain.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortFolioRepository extends JpaRepository<Portfolio,Long> {
}
