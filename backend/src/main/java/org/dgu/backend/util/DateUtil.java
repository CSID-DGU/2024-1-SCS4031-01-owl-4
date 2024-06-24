package org.dgu.backend.util;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Component
public class DateUtil {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    public LocalDateTime convertToLocalDateTime(String date) {
        return LocalDateTime.parse(date, FORMATTER);
    }

    public LocalDateTime calculateDailyStartDate() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate;

        // 현재 시간이 오전 9시 이전이면 전날 오전 9시부터 필터링
        if (now.toLocalTime().isBefore(LocalTime.of(9, 0))) {
            startDate = now.minusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        } else {
            startDate = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
        }

        return startDate;
    }
}