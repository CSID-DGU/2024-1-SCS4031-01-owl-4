package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum EncryptionErrorResult implements BaseErrorCode {
    KEY_PAIR_GENERATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "500", "키 쌍 생성에 실패했습니다."),
    SECRET_KEY_GENERATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "500", "시크릿 키생성에 실패했습니다."),
    RSA_ENCRYPTION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "500", "RSA 암호화에 실패했습니다."),
    RSA_DECRYPTION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "500", "RSA 복호화에 실패했습니다."),
    AES_ENCRYPTION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "500", "AES 암호화에 실패했습니다."),
    AES_DECRYPTION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "500", "AES 복호화에 실패했습니다."),
    PRIVATE_KEY_DECRYPTION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "500", "프라이빗 키 복호화에 실패했습니다.");

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