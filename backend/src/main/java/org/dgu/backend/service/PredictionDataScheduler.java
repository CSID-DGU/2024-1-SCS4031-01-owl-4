package org.dgu.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Prediction;
import org.dgu.backend.dto.ChartDto;
import org.dgu.backend.dto.PredictionDto;
import org.dgu.backend.exception.PredictionErrorResult;
import org.dgu.backend.exception.PredictionException;
import org.dgu.backend.repository.PredictionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Transactional
@EnableScheduling
public class PredictionDataScheduler {
    @Value("${ai.url.train}")
    private String AI_URL_TRAIN;
    @Value("${ai.url.predict}")
    private String AI_URL_PREDICT;
    private final ChartService chartService;
    private final PredictionRepository predictionRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Train 실행 메서드
    //@Scheduled(cron = "0 0 0 * * *")  // 매일 00:00에 실행
    public void startTrain() {
        List<ChartDto.OHLCVResponse> ohlcvResponses = chartService.getOHLCVCharts("비트코인", "days", null);
        // Train 요청
        ResponseEntity<String> trainResponseEntity = restTemplate.exchange(
                AI_URL_TRAIN,
                HttpMethod.POST,
                new HttpEntity<>(ohlcvResponses),
                String.class
        );
        String trainMessage = trainResponseEntity.getBody();
        if (Objects.isNull(trainMessage)) {
            throw new PredictionException(PredictionErrorResult.FAIL_TO_TRAINING);
        }
        System.out.println("Train Message: " + trainMessage);

    }

    // Prediction 값을 받아오는 메서드
    //@Scheduled(cron = "0 10 0 * * *")  // 매일 00:10에 실행
    public void getPrediction() {
        List<ChartDto.OHLCVResponse> ohlcvResponses = chartService.getOHLCVCharts("비트코인", "days", null);
        // Prediction 요청
        ResponseEntity<String> predictResponseEntity = restTemplate.exchange(
                AI_URL_PREDICT,
                HttpMethod.POST,
                new HttpEntity<>(ohlcvResponses),
                String.class
        );
        if (Objects.isNull(predictResponseEntity.getBody())) {
            throw new PredictionException(PredictionErrorResult.FAIL_TO_PREDICTION);
        }
        String responseBody = predictResponseEntity.getBody();

        // JSON 문자열을 PredictionDto 배열로 변환
        PredictionDto.PredictionResponse[] predictions;
        try {
            predictions = objectMapper.readValue(responseBody, PredictionDto.PredictionResponse[].class);
        } catch (IOException e) {
            throw new PredictionException(PredictionErrorResult.FAIL_TO_PARSE_RESPONSE);
        }

        // 기존 값 제거
        List<Prediction> existPredictions = predictionRepository.findAll();
        if (!Objects.isNull(existPredictions)) {
            predictionRepository.deleteAll(existPredictions);
            predictionRepository.flush();
        }
        // 변환된 데이터를 엔티티로 저장
        Arrays.stream(predictions)
                .map(prediction -> new Prediction(prediction.getDate(), prediction.getClose()))
                .forEach(predictionRepository::save);
    }
}