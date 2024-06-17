package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.ChartDto;
import org.dgu.backend.dto.DashBoardDto;
import org.dgu.backend.service.ChartService;
import org.dgu.backend.service.DashBoardService;
import org.dgu.backend.util.DateUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashBoardController {
    private final DashBoardService dashBoardService;
    private final ChartService chartService;
    private final DateUtil dateUtil;

    // 유저 업비트 잔고 조회 API
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<DashBoardDto.UserAccountResponse>> getUserBalance(
            @RequestHeader("Authorization") String authorizationHeader) {

        DashBoardDto.UserAccountResponse userBalanceResponse  = dashBoardService.getUserAccount(authorizationHeader);

        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_USER_BALANCE, userBalanceResponse);
    }

    // 유저 업비트 보유 코인 조회 API
    @GetMapping("/coins/possession")
    public ResponseEntity<ApiResponse<List<DashBoardDto.UserCoinResponse>>> getUserCoins(
            @RequestHeader("Authorization") String authorizationHeader) {

        List<DashBoardDto.UserCoinResponse> userCoins = dashBoardService.getUserCoins(authorizationHeader);

        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_USER_COINS, userCoins);
    }

    // 대표 코인 12개 조회 API
    @GetMapping("/coins/representative")
    public ResponseEntity<ApiResponse<List<DashBoardDto.RepresentativeCoinResponse>>> getRepresentativeCoins() {

        List<DashBoardDto.RepresentativeCoinResponse> representativeCoinResponses = dashBoardService.getRepresentativeCoins();

        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_REPRESENTATIVE_COINS, representativeCoinResponses);
    }

    // 비트코인 차트 (일봉) 조회 API
    @GetMapping("/bit-charts/days")
    public ResponseEntity<ApiResponse<List<ChartDto.OHLCVResponse>>> getBitcoinDayCharts() {

        List<ChartDto.OHLCVResponse> ohlcvResponses = chartService.getOHLCVCharts("비트코인", "days", null);

        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_BITCOIN_DAY_CHARTS, ohlcvResponses);
    }

    // 비트코인 OHLC 차트 (1분봉) 조회 API
    @GetMapping("/bit-charts/minutes1")
    public ResponseEntity<ApiResponse<List<ChartDto.OHLCResponse>>> getBitcoinOneMinuteCharts() {

        LocalDateTime startDate = dateUtil.calculateDailyStartDate();
        List<ChartDto.OHLCVResponse> ohlcvResponses = chartService.getOHLCVCharts("비트코인", "minutes1", startDate);
        List<ChartDto.OHLCResponse> ohlcResponses = ChartDto.OHLCResponse.ofOHLCResponses(ohlcvResponses);

        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_BITCOIN_ONE_MINUTE_CHARTS, ohlcResponses);
    }

    // 비트코인 V 차트 (1분봉) 조회 API
    @GetMapping("/bit-charts/minutes1/volumes")
    public ResponseEntity<ApiResponse<List<ChartDto.VResponse>>> getBitcoinOneMinuteVolumeCharts() {

        LocalDateTime startDate = dateUtil.calculateDailyStartDate();
        List<ChartDto.OHLCVResponse> ohlcvResponses = chartService.getOHLCVCharts("비트코인", "minutes1", startDate);
        List<ChartDto.VResponse> vResponses = ChartDto.VResponse.ofVResponses(ohlcvResponses);

        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_BITCOIN_ONE_MINUTE_VOLUME_CHARTS, vResponses);
    }
}