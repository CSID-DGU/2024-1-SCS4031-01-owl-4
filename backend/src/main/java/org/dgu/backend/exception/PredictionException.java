package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PredictionException extends RuntimeException {
    private final PredictionErrorResult predictionErrorResult;

    @Override
    public String getMessage() {
        return predictionErrorResult.getMessage();
    }
}