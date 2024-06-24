package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.PredictionDto;
import org.dgu.backend.service.PredictionDataScheduler;
import org.dgu.backend.service.PredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/prediction")
@RequiredArgsConstructor
public class PredictionController {
    private final PredictionService predictionService;
    private final PredictionDataScheduler predictionDataScheduler;

    // 딥러닝 가격 예측 값 조회 API
    @GetMapping
    public ResponseEntity<ApiResponse<List<PredictionDto.PredictionResponse>>> getPredictions() {

        List<PredictionDto.PredictionResponse> predictionResponses = predictionService.getPredictions();
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_PREDICTIONS, predictionResponses);
    }

    // Train 수동 API
    @GetMapping("/train")
    public void startTrain() {

        predictionDataScheduler.startTrain();
    }

    // 가격 예측 값 업데이트 수동 API
    @GetMapping("/update")
    public void getPrediction() {

        predictionDataScheduler.getPrediction();
    }
}