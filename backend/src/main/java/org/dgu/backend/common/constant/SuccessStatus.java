package org.dgu.backend.common.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.dgu.backend.common.code.BaseCode;
import org.dgu.backend.common.dto.ReasonDto;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum SuccessStatus implements BaseCode {
    // 전역 응답 코드
    _OK(HttpStatus.OK, "200", "성공입니다."),
    _CREATED(HttpStatus.CREATED, "201", "생성에 성공했습니다."),
    // Candle
    SUCCESS_ALL_MARKETS(HttpStatus.OK, "200", "모든 가상화폐 목록을 가져오는 데 성공했습니다."),
    SUCCESS_CANDLE_INFOS(HttpStatus.OK, "200", "원하는 캔들차트를 가져오는 데 성공했습니다."),
    // Token
    CREATED_ACCESS_TOKEN(HttpStatus.CREATED, "201", "액세스 토큰 재발행에 성공했습니다."),
    // BackTesting
    SUCCESS_BACKTESTING_RUN(HttpStatus.OK, "200", "백테스팅 실행에 성공했습니다."),
    CREATED_BACKTESTING_RESULT(HttpStatus.CREATED, "201", "백테스팅 결과 저장에 성공했습니다."),
    SUCCESS_GET_RECENT_BACKTESTING_RESULT(HttpStatus.OK, "200", "백테스팅 최근 결과 조회에 성공했습니다."),
    // User
    SUCCESS_LOGOUT(HttpStatus.OK, "200", "유저 로그아웃에 성공했습니다."),
    SUCCESS_ADD_AGREEMENT(HttpStatus.CREATED, "201", "서비스 약관 동의 여부 등록에 성공했습니다."),
    SUCCESS_GET_AGREEMENT(HttpStatus.OK, "200", "서비스 약관 동의 여부 조회에 성공했습니다."),
    // Portfolio
    SUCCESS_GET_PORTFOLIOS(HttpStatus.OK, "200", "포트폴리오 조회에 성공했습니다."),
    SUCCESS_GET_PORTFOLIO_DETAILS(HttpStatus.OK, "200", "포트폴리오 상세 조회에 성공했습니다."),
    SUCCESS_DELETE_PORTFOLIO(HttpStatus.OK, "200", "포트폴리오 삭제에 성공했습니다."),
    SUCCESS_EDIT_PORTFOLIO(HttpStatus.OK, "200", "포트폴리오 정보 수정에 성공했습니다."),
    SUCCESS_ADD_PORTFOLIO_SCRAP(HttpStatus.CREATED, "201", "포트폴리오 즐겨찾기 추가에 성공했습니다."),
    SUCCESS_DELETE_PORTFOLIO_SCRAP(HttpStatus.OK, "200", "포트폴리오 즐겨찾기 삭제에 성공했습니다."),
    // DashBoard
    SUCCESS_GET_USER_BALANCE(HttpStatus.OK, "200", "유저 업비트 잔고 조회에 성공했습니다"),
    SUCCESS_GET_USER_COINS(HttpStatus.OK, "200", "유저 보유 코인 조회에 성공했습니다"),
    SUCCESS_GET_REPRESENTATIVE_COINS(HttpStatus.OK, "200", "대표 코인 조회에 성공했습니다"),
    SUCCESS_GET_BITCOIN_DAY_CHARTS(HttpStatus.OK, "200", "비트코인 일봉 차트 조회에 성공했습니다"),
    SUCCESS_GET_BITCOIN_ONE_MINUTE_CHARTS(HttpStatus.OK, "200", "비트코인 1분봉 OHLC 차트 조회에 성공했습니다"),
    SUCCESS_GET_BITCOIN_ONE_MINUTE_VOLUME_CHARTS(HttpStatus.OK, "200", "비트코인 1분봉 V 차트 조회에 성공했습니다"),
    // Upbit-Key
    SUCCESS_ADD_UPBIT_KEYS(HttpStatus.CREATED, "201", "업비트 키 등록에 성공했습니다"),
    // Chart
    SUCCESS_GET_OHLCV_CHART(HttpStatus.OK, "200", "OHLCV 차트 조회에 성공했습니다."),
    SUCCESS_GET_ALL_CHART_OPTIONS(HttpStatus.OK, "200", "차트 선택 지표 목록 조회에 성공했습니다."),
    // Trading
    SUCCESS_START_TRADING(HttpStatus.CREATED, "201", "자동매매 등록에 성공했습니다."),
    SUCCESS_DELETE_TRADING(HttpStatus.OK, "200", "자동매매 삭제에 성공했습니다."),
    SUCCESS_GET_TRADING_LOGS(HttpStatus.OK, "200", "자동매매 거래 로그 조회에 성공했습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ReasonDto getReason() {
        return ReasonDto.builder()
                .isSuccess(true)
                .code(code)
                .message(message)
                .build();
    }

    @Override
    public ReasonDto getReasonHttpStatus() {
        return ReasonDto.builder()
                .isSuccess(true)
                .httpStatus(httpStatus)
                .code(code)
                .message(message)
                .build();
    }
}