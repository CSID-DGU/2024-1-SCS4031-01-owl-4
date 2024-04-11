package org.dgu.backend.service;

import java.time.LocalDateTime;

public interface CandleInfoService {
    void getCandleInfo(String marketKoreanName, LocalDateTime to, int count, String candleType);
}