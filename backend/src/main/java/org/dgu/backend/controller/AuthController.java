package org.dgu.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.TokenDto;
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
    public ResponseEntity<ApiResponse<TokenDto.TokenResponse>> reissueAccessToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        TokenDto.TokenResponse accessToken = authService.reissueAccessToken(request, response);
        return ApiResponse.onSuccess(SuccessStatus.CREATED_ACCESS_TOKEN, accessToken);
    }

    // 유저 로그아웃 API
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Object>> logout(
            HttpServletResponse response) {

        authService.logout(response);

        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_LOGOUT);
    }
}