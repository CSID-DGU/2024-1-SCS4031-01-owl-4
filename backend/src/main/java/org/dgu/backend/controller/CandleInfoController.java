package org.dgu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.service.CandleInfoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CandleInfoController {
    private final CandleInfoService candleInfoService;

    @GetMapping("/candle/info")
    public void getCandleInfo(
            @RequestParam("market") String koreanName,
            @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam("count") int count) {
        candleInfoService.getCandleInfo(koreanName, to, count);
    }
}
