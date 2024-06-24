package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PortfolioException extends RuntimeException {
    private final PortfolioErrorResult portfolioErrorResult;

    @Override
    public String getMessage() {
        return portfolioErrorResult.getMessage();
    }
}