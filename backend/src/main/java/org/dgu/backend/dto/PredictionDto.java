package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.dgu.backend.domain.Prediction;

import java.util.ArrayList;
import java.util.List;

public class PredictionDto {
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PredictionResponse {
        @JsonProperty("date")
        private String date;
        @JsonProperty("close")
        private Long close;

        public static List<PredictionResponse> ofPredictions(List<Prediction> predictions) {
            List<PredictionResponse> predictionResponses = new ArrayList<>();
            for (Prediction prediction : predictions) {
                predictionResponses.add(PredictionResponse.builder()
                        .date(String.valueOf(prediction.getDate()))
                        .close(prediction.getClose())
                        .build());
            }
            return predictionResponses;
        }
    }
}