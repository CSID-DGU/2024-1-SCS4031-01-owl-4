package org.dgu.backend.service;

import org.dgu.backend.dto.ChartDto;

import java.util.List;

public interface ChartService {
    List<ChartDto.OHLCVResponse> getOHLCVCharts(String koreanName, String candleType);
}