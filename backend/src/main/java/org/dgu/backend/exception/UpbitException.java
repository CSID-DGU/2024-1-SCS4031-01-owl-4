package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UpbitException extends RuntimeException {
    private final UpbitErrorResult upbitErrorResult;

    @Override
    public String getMessage() {
        return upbitErrorResult.getMessage();
    }
}