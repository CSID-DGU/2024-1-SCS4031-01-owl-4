package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.UserDto;
import org.dgu.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // 유저 업비트 키 등록 API
    @PostMapping("/upbit-keys")
    public ResponseEntity<ApiResponse<Object>> addUserUpbitKeys(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody UserDto.UserUpbitKeyRequest userUpbitKeyRequest) {

        userService.addUserUpbitKeys(authorizationHeader, userUpbitKeyRequest);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_ADD_UPBIT_KEYS);
    }
}