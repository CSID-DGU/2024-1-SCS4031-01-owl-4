package org.dgu.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.code.BaseErrorCode;
import org.dgu.backend.domain.Market;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // Token
    @ExceptionHandler(TokenException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleTokenException(TokenException e) {
        TokenErrorResult errorResult = e.getTokenErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Header
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<String> handleMissingHeaderException(MissingRequestHeaderException ex) {
        String errorMessage = "Required header '" + ex.getHeaderName() + "' is missing";
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMessage);
    }
    // User
    @ExceptionHandler(UserException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleUserException(UserException e) {
        UserErrorResult errorResult = e.getUserErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Portfolio
    @ExceptionHandler(PortfolioException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handlePortfolioException(PortfolioException e) {
        PortfolioErrorResult errorResult = e.getPortfolioErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // BackTesting
    @ExceptionHandler(BackTestingException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleBackTestingException(BackTestingException e) {
        BackTestingErrorResult errorResult = e.getBackTestingErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Number
    @ExceptionHandler(NumberException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleNumberException(NumberException e) {
        NumberErrorResult errorResult = e.getNumberErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Upbit
    @ExceptionHandler(UpbitException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleUpbitException(UpbitException e) {
        UpbitErrorResult errorResult = e.getUpbitErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Encryption
    @ExceptionHandler(EncryptionException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleEncryptionException(EncryptionException e) {
        EncryptionErrorResult errorResult = e.getEncryptionErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Chart
    @ExceptionHandler(ChartException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleChartException(ChartException e) {
        ChartErrorResult errorResult = e.getChartErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Market
    @ExceptionHandler(MarketException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleMarketException(MarketException e) {
        MarketErrorResult errorResult = e.getMarketErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Candle
    @ExceptionHandler(CandleException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleCandleException(CandleException e) {
        CandleErrorResult errorResult = e.getCandleErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Trading
    @ExceptionHandler(TradingException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleTradingException(TradingException e) {
        TradingErrorResult errorResult = e.getTradingErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
}