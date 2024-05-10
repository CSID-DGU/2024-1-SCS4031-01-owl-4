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
    public ResponseEntity<ApiResponse<Object>> reissueAccessToken(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody BackTestingDto.StepInfo stepInfo) {

        BackTestingDto.BackTestingResponse backTestingResult  = backTestingService.runBackTesting(authorizationHeader, stepInfo);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_BACKTESTING_RUN, backTestingResult);
    }

    /* 백테스팅 결과 저장
    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Object>> reissueAccessToken(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody BackTestingDto.StepOneInfo stepOneInfo) {

        BackTestingDto.StepOneInfo StepOneInfoResponse = backTestingService.reissueAccessToken(request, response);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_BACKTESTING_RUN, accessToken);
    } */
}