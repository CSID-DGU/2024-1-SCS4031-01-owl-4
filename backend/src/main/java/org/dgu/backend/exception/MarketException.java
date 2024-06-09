package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MarketException extends RuntimeException {
    private final MarketErrorResult marketErrorResult;

    @Override
    public String getMessage() {
        return marketErrorResult.getMessage();
    }
}