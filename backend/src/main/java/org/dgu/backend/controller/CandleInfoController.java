package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.service.CandleInfoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CandleInfoController {
    private final CandleInfoService candleInfoService;

    @GetMapping("/candle/info")
    public void getCandleInfo() {
        candleInfoService.getCandleInfo();
    }
}
