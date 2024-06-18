package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Prediction;
import org.dgu.backend.dto.PredictionDto;
import org.dgu.backend.repository.PredictionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PredictionServiceImpl implements PredictionService {
    private final PredictionRepository predictionRepository;

    // 딥러닝 가격 예측 값 반환 메서드
    @Override
    public List<PredictionDto.PredictionResponse> getPredictions() {
        List<Prediction> predictions = predictionRepository.findAll();
        return PredictionDto.PredictionResponse.ofPredictions(predictions);
    }
}