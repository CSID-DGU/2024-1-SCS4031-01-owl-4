package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.constant.SuccessStatus;
import org.dgu.backend.dto.PortfolioDto;
import org.dgu.backend.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/portfolios")
@RequiredArgsConstructor
public class PortfolioController {
    private final PortfolioService portfolioService;

    // 포트폴리오 목록을 가져오는 API
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getPortfolios(
            @RequestHeader("Authorization") String authorizationHeader) {

        List<PortfolioDto.PortfolioInfos> portfolioInfoGroups = portfolioService.getPortfolios(authorizationHeader);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_PORTFOLIOS, portfolioInfoGroups);
    }
}