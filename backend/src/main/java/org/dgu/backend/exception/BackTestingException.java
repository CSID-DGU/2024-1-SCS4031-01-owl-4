package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BackTestingException extends RuntimeException {
    private final BackTestingErrorResult backTestingErrorResult;

    @Override
    public String getMessage() {
        return backTestingErrorResult.getMessage();
    }
}