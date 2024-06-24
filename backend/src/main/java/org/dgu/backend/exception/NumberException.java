package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class NumberException extends RuntimeException {
    private final NumberErrorResult numberErrorResult;

    @Override
    public String getMessage() {
        return numberErrorResult.getMessage();
    }
}