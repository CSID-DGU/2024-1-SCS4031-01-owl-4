package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.dto.BackTestingDto;
import org.dgu.backend.exception.BackTestingErrorResult;
import org.dgu.backend.exception.BackTestingException;
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

    // 지수 이동평균선을 계산하는 메서드
    public List<BackTestingDto.EMAInfo> calculateEMA(List<CandleInfo> candles, int date) {
        Double k = 2.0 / (date + 1);
        List<Double> emaValues = new ArrayList<>();
        Double ema = candles.get(0).getTradePrice();
        emaValues.add(ema);

        for (int i = 1; i < candles.size(); i++) {
            Double price = candles.get(i).getTradePrice();
            ema = k * price + (1 - k) * ema;
            emaValues.add(ema);
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

            executeTrade(candles, startIndex, stepInfo.getTradingUnit(), backTestingResults);
        }

        return backTestingResults;
    }

    // 거래를 실행하는 메서드
    private void executeTrade(List<CandleInfo> candles, int startIndex, int tradingCnt, List<BackTestingDto.BackTestingResult> backTestingResults) {
        // 초기 세팅
        coin = 0.0;
        executeBuy(candles.get(startIndex).getDateTime(), candles.get(startIndex).getTradePrice(), backTestingResults);
        buyingCnt = 1;
        List<Double> tradePrices = new ArrayList<>();
        tradePrices.add(candles.get(startIndex).getTradePrice());
        Double avgPrice = candles.get(startIndex).getTradePrice();
        startDate = null;

        for (int i = startIndex + 1; i < candles.size(); i++) {
            LocalDateTime currentDate = candles.get(i).getDateTime();
            Double currentPrice = candles.get(i).getTradePrice();

            if (startDate == null) {
                startDate = currentDate;
            }

            Long initialCapital = capital + tradingUnit * (buyingCnt);
            Double curRate = calculateRate(capital, initialCapital, currentPrice, coin);
            // 매수 처리
            if (buyingCnt < tradingCnt && currentPrice < avgPrice * (100 - buyingPoint) / 100) {
                executeBuy(currentDate, currentPrice, backTestingResults);
                buyingCnt++;
                tradePrices.add(currentPrice);
                avgPrice = tradePrices.stream().mapToDouble(Double::doubleValue).sum() / buyingCnt;
            }
            // 전체 자본 대비 수익률을 기준으로 한 익절 처리
            else if (curRate > sellingPoint) {
                executeSell(currentDate, currentPrice, backTestingResults);
                break;
            }
            // 전체 자본 대비 수익률을 기준으로 한 손절 처리
            else if (curRate < -stopLossPoint) {
                executeStopLoss(currentDate, currentPrice, backTestingResults);
                break;
            }
        }
    }

    // 매수 처리 메서드
    private void executeBuy(LocalDateTime currentDate, Double currentPrice, List<BackTestingDto.BackTestingResult> backTestingResults) {
        coin += tradingUnit / currentPrice;
        capital -= tradingUnit;

        backTestingResults.add(BackTestingDto.BackTestingResult.of(currentDate, "BUY", currentPrice, coin, capital, 0.0, 0L, null));
    }

    // 익절 처리 메서드
    private void executeSell(LocalDateTime currentDate, Double currentPrice, List<BackTestingDto.BackTestingResult> backTestingResults) {
        Long initialCapital = capital + tradingUnit * buyingCnt;
        capital += (long) (currentPrice * coin);
        coin = 0.0;
        Long income = capital - initialCapital;
        Double rate = ((double) income / initialCapital) * 100;

        backTestingResults.add(BackTestingDto.BackTestingResult.of(currentDate, "SELL", currentPrice, coin, capital, rate, income, currentDate.compareTo(startDate)));
    }

    // 손절 처리 메서드
    private void executeStopLoss(LocalDateTime currentDate, Double currentPrice, List<BackTestingDto.BackTestingResult> backTestingResults) {
        Long initialCapital = capital + tradingUnit * buyingCnt;
        capital += (long) (currentPrice * coin);
        coin = 0.0;
        Long income = capital - initialCapital;
        Double rate = ((double) income / initialCapital) * 100;

        backTestingResults.add(BackTestingDto.BackTestingResult.of(currentDate, "STOP_LOSS", currentPrice, coin, capital, rate, income, currentDate.compareTo(startDate)));
    }

    // 시작 인덱스를 찾는 메서드
    private int findStartIndex(List<CandleInfo> candles, LocalDateTime goldenCrossPoint) {
        for (int i = 0; i < candles.size(); i++) {
            if (candles.get(i).getDateTime().isEqual(goldenCrossPoint)) {
                return i;
            }
        }

        throw new BackTestingException(BackTestingErrorResult.NOT_FOUND_START_INDEX);
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
        int averageTradePeriod = (int) Math.ceil((double) tradingPeriodSum / totalTradeCount);
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
        Double winRate = positiveTradeCount != 0 ? numberUtil.round((double) positiveTradeCount / totalTradeCount * 100, 2) : 0.0;
        Double lossRate = negativeTradeCount != 0 ? numberUtil.round((double) negativeTradeCount / totalTradeCount * 100, 2) : 0.0;
        Double winLossRatio = negativeTradeCount != 0 ? numberUtil.round((double) positiveTradeCount / negativeTradeCount * 100, 2) : 0.0;

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
        Double rate = numberUtil.round(backTestingResult.getRate(), 2);
        backTestingResult.updateRate(rate);

        return BackTestingDto.TradingLog.of(backTestingResult);
    }

    // 수익률을 계산하는 메서드
    private Double calculateRate(Long capital, Long initialCapital, Double currentPrice, Double coin) {
        Double currentAssetValue = capital + (currentPrice * coin);

        return ((currentAssetValue - initialCapital) / initialCapital) * 100;
    }
}