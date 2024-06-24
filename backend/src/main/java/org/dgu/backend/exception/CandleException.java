package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CandleException extends RuntimeException {
    private final CandleErrorResult candleErrorResult;

    @Override
    public String getMessage() {
        return candleErrorResult.getMessage();
    }
}