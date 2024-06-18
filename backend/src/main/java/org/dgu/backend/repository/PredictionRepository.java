package org.dgu.backend.repository;

import org.dgu.backend.domain.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredictionRepository extends JpaRepository<Prediction,Long> {
}