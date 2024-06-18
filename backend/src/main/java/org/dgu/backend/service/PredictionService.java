package org.dgu.backend.service;

import org.dgu.backend.dto.PredictionDto;

import java.util.List;

public interface PredictionService {
    List<PredictionDto.PredictionResponse> getPredictions();
}