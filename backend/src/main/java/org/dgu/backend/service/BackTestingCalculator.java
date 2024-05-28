package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.dto.BackTestingDto;
import org.dgu.backend.util.NumberUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class BackTestingCalculator {
    private final NumberUtil numberUtil;
    private static Long capital;
    private static Long tradingUnit;
    private static Double buyingPoint;
    private static Double sellingPoint;
    private static Double stopLossPoint;
    private static Double coin;
    private static LocalDateTime startDate;
    private static int buyingCnt;
    private static int positiveTradeCount;
    private static int negativeTradeCount;
    private static int tradingPeriodSum;
    private static Double positiveRatioSum;
    private static Double negativeRatioSum;
    private static Long highValueStrategy;
    private static Long lowValueStrategy;
    private static Long highLossValueStrategy;

    // 캔들 차트에서 중복 데이터를 제거하는 메서드
    public List<CandleInfo> removeDuplicatedCandles(List<CandleInfo> candles) {
        Set<LocalDateTime> uniqueDates = new HashSet<>();
        return candles.stream()
                .filter(candle -> uniqueDates.add(candle.getDateTime()))
                .collect(Collectors.toList());
    }

    // 지수 이동평균선을 계산하는 메서드
    public List<BackTestingDto.EMAInfo> calculateEMA(List<CandleInfo> candles, int date) {
        Double k = 2.0 / (date + 1);
        List<Double> emaValues = new ArrayList<>();
        for (int i = 0; i < candles.size(); i++) {
            Double price = candles.get(i).getTradePrice();
            if (i == 0) {
                emaValues.add(price);
            } else {
                Double ema = k * price + (1 - k) * emaValues.get(i - 1);
                emaValues.add(ema);
            }
        }
        return IntStream.range(0, emaValues.size())
                .mapToObj(i -> BackTestingDto.EMAInfo.builder()
                        .date(candles.get(i).getDateTime())
                        .price(emaValues.get(i).longValue())
                        .build())
                .collect(Collectors.toList());
    }

    // 골든 크로스 지점을 찾아 반환하는 메서드
    public List<LocalDateTime> findGoldenCrossPoints(List<CandleInfo> candles, BackTestingDto.StepInfo stepInfo) {
        List<BackTestingDto.EMAInfo> nDateEMAs = calculateEMA(candles, stepInfo.getNDate());
        List<BackTestingDto.EMAInfo> mDateEMAs = calculateEMA(candles, stepInfo.getMDate());

        int diff = nDateEMAs.size() - mDateEMAs.size();
        List<LocalDateTime> goldenCrossPoints = new ArrayList<>();

        boolean crossed = false; // 골든 크로스가 발생했는지 여부

        for (int i = 0; i < mDateEMAs.size(); i++) {
            Long nPrice = nDateEMAs.get(i + diff).getPrice();
            Long mPrice = mDateEMAs.get(i).getPrice();

            if (nPrice > mPrice && !crossed) {
                goldenCrossPoints.add(mDateEMAs.get(i).getDate());
                crossed = true;
            } else if (nPrice <= mPrice && crossed) {
                crossed = false;
            }
        }

        return goldenCrossPoints;
    }

    // 백테스팅을 실행하는 메서드
    public List<BackTestingDto.BackTestingResult> run(List<CandleInfo> candles, BackTestingDto.StepInfo stepInfo, List<LocalDateTime> goldenCrossPoints) {
        capital = stepInfo.getInitialCapital();        // 초기 자본
        tradingUnit = capital / stepInfo.getTradingUnit(); // 한 번 매수당 금액
        buyingPoint = stepInfo.getBuyingPoint();     // 매수 지점
        sellingPoint = stepInfo.getSellingPoint();   // 익절 지점
        stopLossPoint = stepInfo.getStopLossPoint(); // 손절 지점

        List<BackTestingDto.BackTestingResult> backTestingResults = new ArrayList<>();

        for (LocalDateTime goldenCrossPoint : goldenCrossPoints) {
            int startIndex = findStartIndex(candles, goldenCrossPoint);

            executeTrade(candles, startIndex, backTestingResults);
        }

        return backTestingResults;
    }

    // 거래를 실행하는 메서드
    private void executeTrade(List<CandleInfo> candles, int startIndex, List<BackTestingDto.BackTestingResult> backTestingResults) {
        // 초기 세팅
        coin = 0.0;
        executeBuy(candles.get(startIndex).getDateTime(), candles.get(startIndex).getTradePrice(), backTestingResults);
        buyingCnt = 1;
        List<Double> tradePrices = new ArrayList<>();
        tradePrices.add(candles.get(startIndex).getTradePrice());
        Double avgPrice = candles.get(startIndex).getTradePrice();
        startDate = null;

        for (int i = startIndex; i < candles.size(); i++) {
            LocalDateTime currentDate = candles.get(i).getDateTime();
            Double currentPrice = candles.get(i).getTradePrice();

            if (startDate == null) {
                startDate = currentDate;
            }

            // 매수 처리
            if (currentPrice < avgPrice * (100 - buyingPoint) / 100) {
                executeBuy(currentDate, currentPrice, backTestingResults);
                buyingCnt++;
                avgPrice = tradePrices.stream().mapToDouble(Double::doubleValue).sum() / buyingCnt;

                if (buyingCnt == 10 || capital < currentPrice) {
                    executeSell(currentDate, currentPrice, backTestingResults);
                    break;
                }
            }
            // 익절 처리
            else if (currentPrice > avgPrice * (100 + sellingPoint) / 100) {
                executeSell(currentDate, currentPrice, backTestingResults);
                break;
            }
            // 손절 처리
            else if (currentPrice < avgPrice * (100 - stopLossPoint) / 100) {
                executeStopLoss(currentDate, currentPrice, backTestingResults);
                break;
            }
        }
    }

    // 매수 처리 메서드
    private void executeBuy(LocalDateTime currentDate, Double currentPrice, List<BackTestingDto.BackTestingResult> backTestingResults) {
        coin += tradingUnit / currentPrice;
        capital -= tradingUnit;

        backTestingResults.add(BackTestingDto.BackTestingResult.of(currentDate, "BUY", currentPrice, coin, capital, null, null, null));
    }

    // 익절 처리 메서드
    private void executeSell(LocalDateTime currentDate, Double currentPrice, List<BackTestingDto.BackTestingResult> backTestingResults) {
        Long orgCapital = capital + tradingUnit * buyingCnt;
        capital += (long) (currentPrice * coin);
        coin = 0.0;
        Long income = capital - orgCapital;
        Double rate = ((double) income / orgCapital) * 100;

        backTestingResults.add(BackTestingDto.BackTestingResult.of(currentDate, "SELL", currentPrice, coin, capital, rate, income, currentDate.compareTo(startDate)));
    }

    // 손절 처리 메서드
    private void executeStopLoss(LocalDateTime currentDate, Double currentPrice, List<BackTestingDto.BackTestingResult> backTestingResults) {
        Long orgCapital = capital + tradingUnit * buyingCnt;
        capital += (long) (currentPrice * coin);
        coin = 0.0;
        Long income = capital - orgCapital;
        Double rate = ((double) income / orgCapital) * 100;

        backTestingResults.add(BackTestingDto.BackTestingResult.of(currentDate, "STOP_LOSS", currentPrice, coin, capital, rate, income, currentDate.compareTo(startDate)));
    }

    // 시작 인덱스를 찾는 메서드
    private int findStartIndex(List<CandleInfo> candles, LocalDateTime goldenCrossPoint) {
        for (int i = 0; i < candles.size(); i++) {
            if (candles.get(i).getDateTime().isEqual(goldenCrossPoint)) {
                return i;
            }
        }
        return -1;
    }

    // 백테스팅 결과를 집계하는 메서드
    public BackTestingDto.BackTestingResponse collectResults(List<BackTestingDto.BackTestingResult> backTestingResults, Long capital) {
        Double initialCapital = Double.parseDouble(String.valueOf(capital));
        Long finalCapital = backTestingResults.get(backTestingResults.size() - 1).getCapital();
        List<BackTestingDto.TradingLog> tradingLogs = new ArrayList<>();
        positiveTradeCount = 0;
        negativeTradeCount = 0;
        tradingPeriodSum = 0;
        positiveRatioSum = 0.0;
        negativeRatioSum = 0.0;
        highValueStrategy = 0L;
        lowValueStrategy = 1_000_000_000L;
        highLossValueStrategy = 0L;

        // 거래 결과 집계
        calculateTradeStats(backTestingResults, tradingLogs);

        // 거래 파트 생성
        BackTestingDto.Trading trading = createTradingPart(capital, finalCapital);

        // 성능 파트 생성
        BackTestingDto.Performance performance = createPerformancePart(initialCapital, finalCapital);

        return BackTestingDto.BackTestingResponse.builder()
                .trading(trading)
                .performance(performance)
                .tradingLogs(tradingLogs)
                .build();
    }

    // 거래 결과 집계 메서드
    private void calculateTradeStats(List<BackTestingDto.BackTestingResult> backTestingResults, List<BackTestingDto.TradingLog> tradingLogs) {
        for (BackTestingDto.BackTestingResult backTestingResult : backTestingResults) {
            if (!backTestingResult.getAction().equals("BUY")) {
                Long income = backTestingResult.getIncome();
                // 이익인 경우
                if (income > 0) {
                    positiveTradeCount++;
                    positiveRatioSum += backTestingResult.getRate();
                    highValueStrategy = Math.max(highValueStrategy, income);
                    lowValueStrategy = Math.min(lowValueStrategy, income);
                }
                // 손해인 경우
                else {
                    negativeTradeCount++;
                    negativeRatioSum += backTestingResult.getRate();
                    highLossValueStrategy = Math.min(highLossValueStrategy, income);
                }
                tradingPeriodSum += backTestingResult.getTradingPeriod();
            }

            // 거래 로그 생성
            tradingLogs.add(createTradingLog(backTestingResult));
        }
    }

    // 거래 파트 생성 메서드
    private BackTestingDto.Trading createTradingPart(Long capital, Long finalCapital) {
        int totalTradeCount = positiveTradeCount + negativeTradeCount;
        int averageTradePeriod = tradingPeriodSum / totalTradeCount;
        Double averagePositiveTrade = positiveTradeCount != 0 ? numberUtil.round(positiveRatioSum / positiveTradeCount, 2) : 0.0;
        Double averageNegativeTrade = negativeTradeCount != 0 ? numberUtil.round(negativeRatioSum / negativeTradeCount, 2) : 0.0;

        return BackTestingDto.Trading.builder()
                .initialCapital(capital)
                .finalCapital(finalCapital)
                .totalTradeCount(totalTradeCount)
                .positiveTradeCount(positiveTradeCount)
                .negativeTradeCount(negativeTradeCount)
                .averageTradePeriod(averageTradePeriod)
                .averagePositiveTrade(averagePositiveTrade)
                .averageNegativeTrade(averageNegativeTrade)
                .build();
    }

    // 성능 파트 생성 메서드
    private BackTestingDto.Performance createPerformancePart(Double initialCapital, Long finalCapital) {
        int totalTradeCount = positiveTradeCount + negativeTradeCount;
        Double totalRate = numberUtil.round(((finalCapital - initialCapital) / initialCapital) * 100, 2);
        Double winRate = numberUtil.round((double) positiveTradeCount / totalTradeCount * 100, 2);
        Double lossRate = numberUtil.round((double) negativeTradeCount / totalTradeCount * 100, 2);
        Double winLossRatio = numberUtil.round((double) positiveTradeCount / negativeTradeCount * 100, 2);

        return BackTestingDto.Performance.builder()
                .totalRate(totalRate)
                .winRate(winRate)
                .lossRate(lossRate)
                .winLossRatio(winLossRatio)
                .highValueStrategy(highValueStrategy)
                .lowValueStrategy(lowValueStrategy)
                .highLossValueStrategy(highLossValueStrategy)
                .build();
    }

    // 거래 로그 생성 메서드
    private BackTestingDto.TradingLog createTradingLog(BackTestingDto.BackTestingResult backTestingResult) {
        return BackTestingDto.TradingLog.builder()
                .type(!backTestingResult.getAction().equals("BUY") ? "매도" : "매수")
                .date(backTestingResult.getDate())
                .capital(backTestingResult.getCapital())
                .coinPrice(backTestingResult.getCoinPrice().longValue())
                .coin(backTestingResult.getCoin())
                .rate(backTestingResult.getRate() != null && !backTestingResult.getRate().isNaN() ? (numberUtil.round(backTestingResult.getRate(), 2)) : 0.0)
                .build();
    }
}