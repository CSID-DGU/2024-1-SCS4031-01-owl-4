package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UpbitErrorResult implements BaseErrorCode  {
    FAIL_GET_RESPONSE(HttpStatus.UNAUTHORIZED, "401", "업비트에서 데이터를 가져오는 데 실패했습니다."),
    UNAUTHORIZED_IP(HttpStatus.UNAUTHORIZED, "401", "허용되지 않은 IP 주소입니다."),
    UNAUTHORIZED_KEY(HttpStatus.UNAUTHORIZED, "401", "올바른 업비트 키가 아닙니다.");

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