package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.DashBoardDto;
import org.dgu.backend.service.DashBoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashBoardController {
    private final DashBoardService dashBoardService;

    // 유저 업비트 잔고 조회 API
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<DashBoardDto.UserAccountResponse>> getUserBalance(
            @RequestHeader("Authorization") String authorizationHeader) {

        DashBoardDto.UserAccountResponse userBalanceResponse  = dashBoardService.getUserAccount(authorizationHeader);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_USER_BALANCE, userBalanceResponse);
    }
}