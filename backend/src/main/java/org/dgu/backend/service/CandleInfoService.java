package org.dgu.backend.service;

import java.time.LocalDateTime;

public interface CandleInfoService {
    void getCandleInfo(String koreanName, LocalDateTime to, int count, String candleName);
}