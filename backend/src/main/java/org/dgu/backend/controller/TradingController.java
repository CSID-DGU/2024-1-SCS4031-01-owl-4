package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.TradingDto;
import org.dgu.backend.service.TradingService;
import org.dgu.backend.service.UpbitAutoTrader;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trading")
@RequiredArgsConstructor
public class TradingController {
    private final TradingService tradingService;

    // 자동매매 등록 API
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> registerAutoTrading(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody TradingDto.AutoTradingRequest autoTradingRequest) {

        tradingService.registerAutoTrading(authorizationHeader, autoTradingRequest);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_START_TRADING);
    }

    // 자동매매 삭제 API
    @DeleteMapping
    public ResponseEntity<ApiResponse<Object>> removeAutoTrading(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("portfolio_id") String portfolioId) {

        tradingService.removeAutoTrading(authorizationHeader, portfolioId);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_DELETE_TRADING);
    }

    // 자동매매 수동 테스트 API
    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<TradingDto.TradingLog>>> getUserTradingLogs(
            @RequestHeader("Authorization") String authorizationHeader) {

        List<TradingDto.TradingLog> tradingLogs = tradingService.getUserTradingLogs(authorizationHeader);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_TRADING_LOGS, tradingLogs);
    }
}