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

    // 포트폴리오 전체 조회 API
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getPortfolios(
            @RequestHeader("Authorization") String authorizationHeader) {

        List<PortfolioDto.PortfolioInfos> portfolioInfoGroups = portfolioService.getPortfolios(authorizationHeader);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_PORTFOLIOS, portfolioInfoGroups);
    }

    // 포트폴리오 상세 조회 API
    @GetMapping("/detail")
    public ResponseEntity<ApiResponse<Object>> getPortfolioDetails(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("portfolio_id") String portfolioId) {

        PortfolioDto.PortfolioDetailInfos portfolioDetailInfos = portfolioService.getPortfolioDetails(authorizationHeader, portfolioId);
        return ApiResponse.onSuccess(SuccessStatus.SUCCESS_GET_PORTFOLIO_DETAILS, portfolioDetailInfos);
    }
}