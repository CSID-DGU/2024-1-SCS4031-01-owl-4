package org.dgu.backend.util;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.dto.BackTestingDto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
@RequiredArgsConstructor
public class BackTestingUtil {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    // 필터링된 캔들 차트를 반환하는 메서드
    public List<CandleInfo> getFilteredCandleInfoList(List<CandleInfo> allCandleInfoList, String start, String end) {

        // startDate부터 endDate까지의 데이터를 필터링
        LocalDateTime startDate = LocalDateTime.parse(start, FORMATTER);
        LocalDateTime endDate = LocalDateTime.parse(end, FORMATTER);

        // 중복을 제거하고 날짜를 기준으로 정렬한 결과를 저장할 리스트
        List<CandleInfo> filteredCandleInfoList = new ArrayList<>();
        // 중복을 체크하기 위한 HashSet
        Set<LocalDateTime> dateSet = new HashSet<>();

        // 데이터 필터링 및 중복 제거
        for (CandleInfo candleInfo : allCandleInfoList) {
            LocalDateTime timestamp = LocalDateTime.parse(candleInfo.getDateTime(), FORMATTER);
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
                .date(LocalDateTime.parse(candleInfos.get(date - 1).getDateTime(), FORMATTER))
                .price((long) initialEMA)
                .build());

        // 지수 이동평균 계산
        for (int i = date; i < candleInfos.size(); i++) {
            double price = candleInfos.get(i).getTradePrice();
            double ema = k * price + (1 - k) * result.get(result.size() - 1).getPrice();
            result.add(BackTestingDto.EMAInfo.builder()
                    .date(LocalDateTime.parse(candleInfos.get(i).getDateTime(), FORMATTER))
                    .price((long) ema)
                    .build());
        }

        return result;
    }

    // 골든 크로스 지점을 찾아 반환하는 메서드
    public List<LocalDateTime> findGoldenCrossPoints(List<BackTestingDto.EMAInfo> nDateEMAs, List<BackTestingDto.EMAInfo> mDateEMAs) {
        int diff = nDateEMAs.size() - mDateEMAs.size();
        boolean possible = true;
        List<LocalDateTime> goldenCrossPoints = new ArrayList<>();

        for (int i = 0; i < mDateEMAs.size(); i++) {
            LocalDateTime curDate = mDateEMAs.get(i).getDate();
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

    // 백테스팅을 실행하는 메서드
    public List<BackTestingDto.BackTestingResult> run(List<CandleInfo> allCandleInfoList, BackTestingDto.StepInfo stepInfo, List<LocalDateTime> goldenCrossPoints) {
        Double buyingPoint = stepInfo.getBuyingPoint();     // 매수 지점
        Double sellingPoint = stepInfo.getSellingPoint();   // 익절 지점
        Double stopLossPoint = stepInfo.getStopLossPoint(); // 손절 지점
        Long capital = stepInfo.getInitialCapital(); // 초기 자본
        Long tradingUnit = capital / stepInfo.getTradingUnit(); // 한 번 매수당 금액
        int infoIndex = 0;
        int pointIndex = 0;

        List<BackTestingDto.BackTestingResult> backTestingResults = new ArrayList<>();

        while (pointIndex < goldenCrossPoints.size() && infoIndex < allCandleInfoList.size()) {
            LocalDateTime infoDate = LocalDateTime.parse(allCandleInfoList.get(infoIndex).getDateTime(), FORMATTER);
            LocalDateTime goldenCrossPoint = goldenCrossPoints.get(pointIndex);

            // 골든 포인트 지점이 현재 날짜보다 이른 경우
            if (goldenCrossPoint.isBefore(infoDate)) {
                pointIndex++;
                continue;
            }

            // 골든 포인트 지점인 경우
            if (infoDate.equals(goldenCrossPoint)) {
                // 초기 매수 횟수와 평단가 설정
                int buyingCnt = 1;
                Double avgPrice = allCandleInfoList.get(infoIndex).getTradePrice();
                Double coin = tradingUnit / allCandleInfoList.get(infoIndex).getTradePrice();
                capital -= tradingUnit;

                // 골든 크로스 포인트에서부터 마지막 캔들까지 순회
                while (infoIndex < allCandleInfoList.size()) {
                    Double currentPrice = allCandleInfoList.get(infoIndex).getTradePrice();
                    LocalDateTime currentDate = LocalDateTime.parse(allCandleInfoList.get(infoIndex).getDateTime(), FORMATTER);

                    // 평단가에서 buyingPoint 만큼 떨어지면 매수
                    if (currentPrice < avgPrice * (100 - buyingPoint) / 100) {
                        // 매수 처리
                        if (buyingCnt < stepInfo.getTradingUnit()) {
                            buyingCnt++;
                            coin += tradingUnit / currentPrice;
                            capital -= tradingUnit;

                            BackTestingDto.BackTestingResult result = createResult(currentDate, "Buy", currentPrice, capital, coin);
                            backTestingResults.add(result);

                            // 평단가 업데이트
                            avgPrice = (avgPrice + currentPrice) / buyingCnt;
                        }
                    }
                    // 평단가에서 sellingPoint 만큼 올라가면 익절
                    else if (currentPrice > avgPrice * (100 + sellingPoint) / 100) {
                        // 익절 처리
                        capital = (long) (capital + (currentPrice * coin));
                        coin = 0.0;

                        BackTestingDto.BackTestingResult result = createResult(currentDate, "Sell", currentPrice, capital, coin);
                        backTestingResults.add(result);
                        break; // 익절 시 거래 종료
                    }
                    // 평단가에서 stopLossPoint 만큼 떨어지면 손절
                    else if (currentPrice < avgPrice * (100 - stopLossPoint) / 100) {
                        // 손절 처리
                        capital = (long) (capital + (currentPrice * coin));
                        coin = 0.0;

                        BackTestingDto.BackTestingResult result = createResult(currentDate, "Stop Loss", currentPrice, capital, coin);
                        backTestingResults.add(result);
                        break; // 손절 시 거래 종료
                    }

                    infoIndex++;
                }
                // 다음 골든 크로스 포인트로 이동
                pointIndex++;
            } else {
                infoIndex++;
            }
        }

        return backTestingResults;
    }

    // 거래 결과 생성 메서드
    private BackTestingDto.BackTestingResult createResult(LocalDateTime date, String action, Double price, Long capital, Double coin) {
        return BackTestingDto.BackTestingResult.builder()
                .date(date)
                .action(action)
                .price(price)
                .capital(capital)
                .coin(coin)
                .build();
    }
}