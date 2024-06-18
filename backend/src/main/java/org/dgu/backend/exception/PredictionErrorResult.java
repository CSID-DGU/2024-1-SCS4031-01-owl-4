package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PredictionErrorResult implements BaseErrorCode {
    FAIL_TO_TRAINING(HttpStatus.NOT_FOUND, "404", "딥러닝 트레이닝에 실패했습니다."),
    FAIL_TO_PREDICTION(HttpStatus.NOT_FOUND, "404", "딥러닝 가격 예측 데이터 받아 오기에 실패했습니다."),
    FAIL_TO_PARSE_RESPONSE(HttpStatus.NOT_FOUND, "404", "가격 예측 데이터 파싱에 실패했습니다");

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