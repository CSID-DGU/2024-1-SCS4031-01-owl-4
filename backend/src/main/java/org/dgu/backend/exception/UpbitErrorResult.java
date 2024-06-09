package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UpbitErrorResult implements BaseErrorCode  {
    FAIL_ACCESS_USER_ACCOUNT(HttpStatus.NOT_FOUND, "404", "업비트에서 유저 잔고를 가져오는 데 실패했습니다."),
    FAIL_ACCESS_COIN_INFO(HttpStatus.NOT_FOUND, "404", "업비트에서 코인 정보를 가져오는 데 실패했습니다."),
    FAIL_GET_CANDLE_INFO(HttpStatus.NOT_FOUND, "404", "업비트에서 캔들 정보를 가져오는 데 실패했습니다."),
    NOT_FOUND_UPBIT_KEY(HttpStatus.NOT_FOUND, "404", "업비트 키가 존재하지 않습니다."),
    UNAUTHORIZED_IP(HttpStatus.UNAUTHORIZED, "401", "허용되지 않은 IP 주소입니다."),
    UNAUTHORIZED_UPBIT_KEY(HttpStatus.UNAUTHORIZED, "401", "올바른 업비트 키가 아닙니다.");

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