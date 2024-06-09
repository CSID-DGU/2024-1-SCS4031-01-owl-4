package org.dgu.backend.util;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.CandleInfo;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Component
@RequiredArgsConstructor
public class CandleUtil {
    private static final List<String> SEVEN_DAY_CANDLES = Arrays.asList("minutes1", "minutes3", "minutes5", "minutes10", "minutes15", "minutes30");
    private static final List<String> SIX_MONTH_CANDLES = Arrays.asList("minutes60", "minutes240");

    // 캔들을 분 기준으로 변환하는 메서드
    public int calculateCandleInterval(String candleName) {
        switch (candleName) {
            case "days":
                return 1440; // 1일(24시간 * 60분)
            case "weeks":
                return 10080; // 1주(7일 * 24시간 * 60분)
            case "months":
                return 43200; // 1개월(30일 * 24시간 * 60분)
            default: // minutesN 형식의 캔들 타입 처리
                return Integer.parseInt(candleName.replace("minutes", ""));
        }
    }

    // 캔들 종류에 따라 시작 기간을 계산해 반환하는 메서드
    public LocalDateTime getStartDateByCandleName(String candleName) {
        LocalDateTime now = LocalDateTime.now();
        if (SEVEN_DAY_CANDLES.contains(candleName)) {
            return now.minusDays(7);
        } else if (SIX_MONTH_CANDLES.contains(candleName)) {
            return now.minusMonths(6);
        } else {
            return LocalDateTime.of(2019, 1, 1, 0, 0);
        }
    }

    // 캔들 차트에서 중복 데이터를 제거하는 메서드
    public List<CandleInfo> removeDuplicatedCandles(List<CandleInfo> candles) {
        Set<LocalDateTime> uniqueDates = new HashSet<>();
        return candles.stream()
                .filter(candle -> uniqueDates.add(candle.getDateTime()))
                .collect(Collectors.toList());
    }
}