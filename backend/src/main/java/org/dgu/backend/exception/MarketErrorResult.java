package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MarketErrorResult implements BaseErrorCode {
    NOT_FOUND_MARKET(HttpStatus.NOT_FOUND, "404", "존재하지 않는 가상화폐입니다."),
    NOT_FOUND_MARKETS(HttpStatus.NOT_FOUND, "404", "가상화폐 목록이 존재하지 않습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDto getReason() {
        return ErrorReasonDto.builder()
                .isSuccess(false)
                .code(code)
                .message(message)
                .build();
    }

    @Override
    public ErrorReasonDto getReasonHttpStatus() {
        return ErrorReasonDto.builder()
                .isSuccess(false)
                .httpStatus(httpStatus)
                .code(code)
                .message(message)
                .build();
    }
}