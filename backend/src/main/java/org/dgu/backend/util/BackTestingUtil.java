package org.dgu.backend.util;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.dto.BackTestingDto;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
@RequiredArgsConstructor
public class BackTestingUtil {

    // 필터링된 캔들 차트를 반환하는 메서드
    public List<CandleInfo> getFilteredCandleInfoList(List<CandleInfo> allCandleInfoList, String start, String end) {
        // startDate부터 endDate까지의 데이터를 필터링
        LocalDate startDate = LocalDate.parse(start, DateTimeFormatter.ISO_LOCAL_DATE);
        LocalDate endDate = LocalDate.parse(end, DateTimeFormatter.ISO_LOCAL_DATE);

        // 중복을 제거하고 날짜를 기준으로 정렬한 결과를 저장할 리스트
        List<CandleInfo> filteredCandleInfoList = new ArrayList<>();
        // 중복을 체크하기 위한 HashSet
        Set<LocalDate> dateSet = new HashSet<>();

        // 데이터 필터링 및 중복 제거
        for (CandleInfo candleInfo : allCandleInfoList) {
            LocalDate timestamp = candleInfo.getDateTime();
            // 시작일(startDate)과 종료일(endDate)을 포함하고 중복을 제거하여 리스트에 추가
            if (!timestamp.isBefore(startDate) && !timestamp.isAfter(endDate) && dateSet.add(timestamp)) {
                filteredCandleInfoList.add(candleInfo);
            }
        }

        // 날짜를 기준으로 오름차순으로 정렬
        filteredCandleInfoList.sort(Comparator.comparing(CandleInfo::getDateTime));

        return filteredCandleInfoList;
    }

    // 지수 이동평균선을 계산하는 메서드
    public List<BackTestingDto.EMAInfo> calculateEMA(List<CandleInfo> candleInfos, int date) {
        List<BackTestingDto.EMAInfo> result = new ArrayList<>();

        double k = 2.0 / (date + 1); // 지수 가중치 계산을 위한 상수

        // 초기값 설정
        double sum = 0;
        for (int i = 0; i < date; i++) {
            sum += candleInfos.get(i).getTradePrice();
        }
        double initialEMA = sum / date;
        result.add(BackTestingDto.EMAInfo.builder()
                .date(candleInfos.get(date - 1).getDateTime())
                .price((long) initialEMA)
                .build());

        // 지수 이동평균 계산
        for (int i = date; i < candleInfos.size(); i++) {
            double price = candleInfos.get(i).getTradePrice();
            double ema = k * price + (1 - k) * result.get(result.size() - 1).getPrice();
            result.add(BackTestingDto.EMAInfo.builder()
                    .date(candleInfos.get(i).getDateTime())
                    .price((long) ema)
                    .build());
        }

        return result;
    }

    // 골든 크로스 지점을 찾아 반환하는 메서드
    public List<LocalDate> findGoldenCrossPoints(List<BackTestingDto.EMAInfo> nDateEMAs, List<BackTestingDto.EMAInfo> mDateEMAs) {
        int diff = nDateEMAs.size() - mDateEMAs.size();
        boolean possible = true;
        List<LocalDate> goldenCrossPoints = new ArrayList<>();

        for (int i = 0; i < mDateEMAs.size(); i++) {
            LocalDate curDate = mDateEMAs.get(i).getDate();
            Long nPrice = nDateEMAs.get(i + diff).getPrice();
            Long mPrice = mDateEMAs.get(i).getPrice();

            if (possible && nPrice > mPrice) {
                goldenCrossPoints.add(curDate);
                possible = false;
            }

            else if (nPrice < mPrice) {
                possible = true;
            }
        }

        return goldenCrossPoints;
    }
}