package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum NumberErrorResult implements BaseErrorCode {
    INVALID_NEGATIVE_DECIMAL(HttpStatus.INTERNAL_SERVER_ERROR, "500", "소숫점은 음수로 지정할 수 없습니다."),
    VALUE_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "500", "값이 존재하지 않습니다 (Null or NaN)"),
    VALUE_IS_INFINITE(HttpStatus.INTERNAL_SERVER_ERROR, "500", "값이 무한입니다.");

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