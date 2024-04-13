package org.dgu.backend.util;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.service.CandleInfoService;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Component
@RequiredArgsConstructor
public class CandleDataCollector {
    private final CandleInfoService candleInfoService;
    private final int batchSize = 200; // 한 번에 가져올 데이터 양

    public void collectData() {
        LocalDateTime startTime = LocalDateTime.of(2018, Month.JANUARY, 1, 0, 0);
        LocalDateTime endTime = LocalDateTime.of(2024, Month.APRIL, 13, 0, 0);

        // 시작 시간부터 종료 시간까지의 총 분 수 계산
        long totalMinutes = Duration.between(startTime, endTime).toMinutes();

        // 반복 횟수 계산
        long numIterations = (long) Math.ceil((double) totalMinutes / batchSize);

        CompletableFuture<Void>[] futures = new CompletableFuture[(int) numIterations];

        for (int i = 0; i < numIterations; i++) {
            LocalDateTime currentStartTime = startTime.plusMinutes((long) i * batchSize);
            LocalDateTime currentEndTime = currentStartTime.plusMinutes(batchSize);

            // 종료 시간이 endTime을 넘어가면 endTime으로 설정
            if (currentEndTime.isAfter(endTime)) {
                currentEndTime = endTime;
            }

            final LocalDateTime intervalEnd = currentEndTime;

            futures[i] = CompletableFuture.runAsync(() -> {
                // candleInfoService를 사용하여 데이터 수집
                candleInfoService.getCandleInfo("비트코인", intervalEnd, batchSize, "minutes1");
            });

            // 요청 간격 설정 (1초에 10회 요청 가능)
            if (i < numIterations - 1) {
                try {
                    Thread.sleep(100); // 100밀리초(0.1초) 대기
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }

        // 모든 CompletableFuture가 완료될 때까지 대기
        CompletableFuture<Void> allOfFuture = CompletableFuture.allOf(futures);
        try {
            allOfFuture.get(); // 모든 작업이 완료될 때까지 대기
            System.out.println("모든 작업이 완료되었습니다.");
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }
}