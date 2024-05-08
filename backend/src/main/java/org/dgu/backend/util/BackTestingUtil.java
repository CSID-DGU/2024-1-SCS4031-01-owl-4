package org.dgu.backend.util;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.CandleInfo;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
@RequiredArgsConstructor
public class BackTestingUtil {
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
}