package org.dgu.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.common.dto.ErrorReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UpbitErrorResult implements BaseErrorCode {
    // HTTP 401 Unauthorized 에러 처리
    INVALID_QUERY_PAYLOAD(HttpStatus.UNAUTHORIZED, "invalid_query_payload", "JWT 헤더의 페이로드가 올바르지 않습니다. 서명에 사용한 페이로드 값을 확인해주세요."),
    JWT_VERIFICATION(HttpStatus.UNAUTHORIZED, "jwt_verification", "JWT 헤더 검증에 실패했습니다. 토큰이 올바르게 생성, 서명되었는지 확인해주세요."),
    EXPIRED_ACCESS_KEY(HttpStatus.UNAUTHORIZED, "expired_access_key", "API 키가 만료되었습니다."),
    NONCE_USED(HttpStatus.UNAUTHORIZED, "nonce_used", "이미 요청한 nonce값이 다시 사용되었습니다. JWT 헤더 페이로드의 nonce 값은 매번 새로운 값을 사용해야합니다."),
    NO_AUTHORIZATION_IP(HttpStatus.UNAUTHORIZED, "no_authorization_ip", "허용되지 않은 IP 주소입니다."),
    OUT_OF_SCOPE(HttpStatus.UNAUTHORIZED, "out_of_scope", "허용되지 않은 기능입니다."),
    FAIL_GET_RESPONSE(HttpStatus.UNAUTHORIZED, "401", "업비트에서 데이터를 가져오는 데 실패했습니다."),
    UNAUTHORIZED_KEY(HttpStatus.UNAUTHORIZED, "401", "올바른 업비트 키가 아닙니다."),
    // HTTP 400 Bad Request 에러 처리
    CREATE_ASK_ERROR(HttpStatus.BAD_REQUEST, "create_ask_error", "주문 요청 정보가 올바르지 않습니다."),
    CREATE_BID_ERROR(HttpStatus.BAD_REQUEST, "create_bid_error", "주문 요청 정보가 올바르지 않습니다."),
    INSUFFICIENT_FUNDS_ASK(HttpStatus.BAD_REQUEST, "insufficient_funds_ask", "매수 가능 잔고가 부족합니다."),
    INSUFFICIENT_FUNDS_BID(HttpStatus.BAD_REQUEST, "insufficient_funds_bid", "매도 가능 잔고가 부족합니다."),
    UNDER_MIN_TOTAL_ASK(HttpStatus.BAD_REQUEST, "under_min_total_ask", "주문 요청 금액이 최소주문금액 미만입니다."),
    UNDER_MIN_TOTAL_BID(HttpStatus.BAD_REQUEST, "under_min_total_bid", "주문 요청 금액이 최소주문금액 미만입니다."),
    WITHDRAW_ADDRESS_NOT_REGISTERED(HttpStatus.BAD_REQUEST, "withdraw_address_not_registerd", "허용되지 않은 출금 주소입니다. 허용 목록에 등록된 주소로만 출금이 가능합니다."),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "validation_error", "잘못된 API 요청입니다. 누락된 파라미터가 없는지 확인해주세요."),
    // 그 외
    HAS_NO_BITCOIN(HttpStatus.NOT_FOUND, "404", "비트코인을 소유하고 있지 않습니다.");

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