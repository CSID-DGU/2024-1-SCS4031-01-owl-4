package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TradingException extends RuntimeException {
    private final TradingErrorResult tradingErrorResult;

    @Override
    public String getMessage() {
        return tradingErrorResult.getMessage();
    }
}