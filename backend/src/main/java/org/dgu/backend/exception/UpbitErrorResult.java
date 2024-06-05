package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UpbitErrorResult implements BaseErrorCode  {
    FAIL_ACCESS_USER_ACCOUNT(HttpStatus.NOT_FOUND, "404", "업비트에서 유저 잔고를 가져오는 데 실패했습니다.");

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