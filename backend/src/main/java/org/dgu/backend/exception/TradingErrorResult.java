package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum TradingErrorResult implements BaseErrorCode {
    BELOW_MINIMUM_PURCHASE_AMOUNT(HttpStatus.BAD_REQUEST, "400", "최소 매수 금액은 5,000원 이상입니다."),
    IS_NOT_AGREED_USER(HttpStatus.UNAUTHORIZED, "401", "약관을 동의하지 않은 유저입니다."),
    HAS_NOT_UPBIT_KEY(HttpStatus.UNAUTHORIZED, "401", "업비트 키를 등록하지 않은 유저입니다."),
    IS_ALREADY_TRADING(HttpStatus.CONFLICT, "409", "이미 자동매매 등록이 되어있는 포트폴리오입니다."),
    IS_NOT_SAVED_PORTFOLIO(HttpStatus.BAD_REQUEST, "400", "저장되지 않은 포트폴리오입니다."),
    IS_NOT_TRADE_PORTFOLIO(HttpStatus.BAD_REQUEST, "400", "자동매매 중인 포트폴리오가 아닙니다.");

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