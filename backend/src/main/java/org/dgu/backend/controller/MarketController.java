package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.service.MarketService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class MarketController {
    private final MarketService marketService;

    // 업비트에 존재하는 가상화폐 정보를 가져오는 API (원화 기준만)
    @GetMapping("/market/all")
    public void getCandleInfo() {
        marketService.getAllMarkets();
    }
}
