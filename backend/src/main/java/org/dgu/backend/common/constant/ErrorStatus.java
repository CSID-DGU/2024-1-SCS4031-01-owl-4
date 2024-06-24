package org.dgu.backend.common.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
    // 전역 에러
    _INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"500", "서버에서 요청을 처리 하는 동안 오류가 발생했습니다."),
    _BAD_REQUEST(HttpStatus.BAD_REQUEST,"400", "입력 값이 잘못된 요청 입니다."),
    _UNAUTHORIZED(HttpStatus.UNAUTHORIZED,"401", "인증이 필요 합니다."),
    _FORBIDDEN(HttpStatus.FORBIDDEN, "403", "금지된 요청 입니다.");

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