package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ChartException extends RuntimeException {
    private final ChartErrorResult chartErrorResult;

    @Override
    public String getMessage() {
        return chartErrorResult.getMessage();
    }
}