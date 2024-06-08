package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.util.CandleDataCollector;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CandleInfoController {
    private final CandleDataCollector candleDataCollector;

    /* 업비트에서 캔들차트를 가져오는 API
    @GetMapping("/candle/info")
    public void getCandleInfo(
            @RequestParam("market") String koreanName,
            @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam("count") int count,
            @RequestParam("candle_type") String candleType) {

        candleInfoService.getCandleInfo(koreanName, to, count, candleType);
    } */

    // 원하는 가상화폐 & 기간 & 캔들 종류에 따른 데이터를 가져오는 API
    @GetMapping("/candle/info/all")
    public ResponseEntity<ApiResponse<Object>> collectCandleData(
            @RequestParam("coin_name") String koreanName,
            @RequestParam("start_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("end_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam("candle_name") String candleName) {

        candleDataCollector.collectCandleData(koreanName, startDate, endDate, candleName);

        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_CANDLE_INFOS);
    }
}