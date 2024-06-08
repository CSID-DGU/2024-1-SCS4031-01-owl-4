package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.ChartDto;
import org.dgu.backend.service.ChartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/charts")
@RequiredArgsConstructor
public class ChartController {
    private final ChartService chartService;

    // OHLCV 차트를 조회하는 API
    @GetMapping
    public ResponseEntity<ApiResponse<List<ChartDto.OHLCVResponse>>> getOHLCVCharts(
            @RequestParam("coin_name") String koreanName,
            @RequestParam("candle_name") String candleName) {

        List<ChartDto.OHLCVResponse> ohlcvResponses = chartService.getOHLCVCharts(koreanName, candleName);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_OHLCV_CHART, ohlcvResponses);
    }
}