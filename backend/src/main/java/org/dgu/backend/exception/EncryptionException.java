package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class EncryptionException extends RuntimeException {
    private final EncryptionErrorResult encryptionErrorResult;

    @Override
    public String getMessage() {
        return encryptionErrorResult.getMessage();
    }
}