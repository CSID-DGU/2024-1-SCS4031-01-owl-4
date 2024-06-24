package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.BackTestingDto;
import org.dgu.backend.service.BackTestingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/backtesting")
@RequiredArgsConstructor
public class BackTestingController {
    private final BackTestingService backTestingService;

    // 백테스팅 Step1,2 입력 후 백테스팅 실행 API
    @PostMapping("/run")
    public ResponseEntity<ApiResponse<BackTestingDto.BackTestingResponse>> getBackTestingResult(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody BackTestingDto.StepInfo stepInfo) {

        BackTestingDto.BackTestingResponse backTestingResult  = backTestingService.createBackTestingResult(authorizationHeader, stepInfo);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_BACKTESTING_RUN, backTestingResult);
    }

    // 백테스팅 결과 저장 API
    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Object>> saveBackTestingResult(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody BackTestingDto.SavingRequest savingRequest) {

        backTestingService.saveBackTestingResult(authorizationHeader, savingRequest);
        return ApiResponse.onSuccess(SuccessStatus.CREATED_BACKTESTING_RESULT);
    }

    // 백테스팅 최근 결과 조회 API
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<BackTestingDto.BackTestingResponse>> getRecentBackTestingResult(
            @RequestHeader("Authorization") String authorizationHeader) {

        BackTestingDto.BackTestingResponse recentBackTestingResult  = backTestingService.getRecentBackTestingResult(authorizationHeader);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_RECENT_BACKTESTING_RESULT, recentBackTestingResult);
    }
}