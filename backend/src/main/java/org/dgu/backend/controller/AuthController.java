package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.response.TokenResponse;
import org.dgu.backend.exception.TokenErrorResult;
import org.dgu.backend.exception.TokenException;
import org.dgu.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    // 액세스 토큰을 재발행하는 API
    @GetMapping("/reissue/access-token")
    public ResponseEntity<ApiResponse<Object>> reissueAccessToken(
            @RequestHeader("Authorization") String authorizationHeader) {

        try {
            TokenResponse accessToken = authService.reissueAccessToken(authorizationHeader);
            return ApiResponse.onSuccess(SuccessStatus._CREATED_ACCESS_TOKEN, accessToken);
        } catch (TokenException e) {
            // 토큰 예외 처리
            TokenErrorResult errorResult = e.getTokenErrorResult();
            return ApiResponse.onFailure(errorResult);
        }
    }
}