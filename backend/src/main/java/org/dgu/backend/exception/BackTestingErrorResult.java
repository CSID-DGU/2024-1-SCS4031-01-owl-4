package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum BackTestingErrorResult implements BaseErrorCode {
    NOT_FOUND_START_INDEX(HttpStatus.NOT_FOUND, "404", "시작 인덱스를 찾을 수 없습니다."),
    START_DATE_AFTER_END_DATE(HttpStatus.BAD_REQUEST, "400", "시작일이 종료일보다 늦습니다."),
    N_DAY_LONGER_THAN_M_DAY(HttpStatus.BAD_REQUEST, "400", "N일이 M일보다 큽니다.");

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