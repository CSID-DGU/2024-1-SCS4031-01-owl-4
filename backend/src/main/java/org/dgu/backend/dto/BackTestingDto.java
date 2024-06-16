package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.dgu.backend.domain.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BackTestingDto {
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class StepInfo {
        private String title;
        private String description;
        private Long initialCapital;
        private String candleName;
        private String startDate;
        private String endDate;
        @JsonProperty("n_date")
        private int nDate;
        @JsonProperty("m_date")
        private int mDate;
        private int tradingUnit;
        private Double buyingPoint;
        private Double sellingPoint;
        private Double stopLossPoint;

        public Portfolio toPortfolio(User user) {
            return Portfolio.builder()
                    .user(user)
                    .title(title)
                    .description(description)
                    .build();
        }

        public PortfolioOption toPortfolioOption(Portfolio portfolio) {
            return PortfolioOption.builder()
                    .portfolio(portfolio)
                    .candleName(candleName)
                    .startDate(LocalDateTime.parse(startDate))
                    .endDate(LocalDateTime.parse(endDate))
                    .nDate(nDate)
                    .mDate(mDate)
                    .tradingUnit(tradingUnit)
                    .buyingPoint(buyingPoint)
                    .sellingPoint(sellingPoint)
                    .stopLossPoint(stopLossPoint)
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BackTestingResult {
        private LocalDateTime date;
        private String action;
        private Double coinPrice;
        private BigDecimal coin;
        private Long capital;
        private Double rate;
        private Long income;
        private Integer tradingPeriod;

        public void updateRate(Double rate) {
            this.rate = rate;
        }

        public static BackTestingDto.BackTestingResult of(LocalDateTime date, String action, Double coinPrice, BigDecimal coin, Long capital, Double rate, Long income, Integer tradingPeriod) {
            return BackTestingDto.BackTestingResult.builder()
                    .date(date)
                    .action(action)
                    .coinPrice(coinPrice)
                    .coin(coin.setScale(3, RoundingMode.HALF_UP))
                    .capital(capital)
                    .rate(rate)
                    .income(income)
                    .tradingPeriod(tradingPeriod)
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EMAInfo {
        private LocalDateTime date;
        private Long price;
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BackTestingResponse {
        private UUID portfolioId;
        private Trading trading;
        private Performance performance;
        private List<TradingLog> tradingLogs;
        private Boolean isSaved;

        public void addId(UUID portfolioId) {
            this.portfolioId = portfolioId;
        }

        public TradingResult toTradingResult(Portfolio portfolio) {
            return TradingResult.builder()
                    .portfolio(portfolio)
                    .initialCapital(trading.getInitialCapital())
                    .finalCapital(trading.getFinalCapital())
                    .totalTradeCount(trading.getTotalTradeCount())
                    .positiveTradeCount(trading.getPositiveTradeCount())
                    .negativeTradeCount(trading.getNegativeTradeCount())
                    .averageTradePeriod(trading.getAverageTradePeriod())
                    .averagePositiveTrade(trading.getAveragePositiveTrade())
                    .averageNegativeTrade(trading.getAverageNegativeTrade())
                    .build();
        }

        public PerformanceResult toPerformanceResult(Portfolio portfolio) {
            return PerformanceResult.builder()
                    .portfolio(portfolio)
                    .totalRate(performance.getTotalRate())
                    .winRate(performance.getWinRate())
                    .lossRate(performance.getLossRate())
                    .winLossRatio(performance.getWinLossRatio())
                    .highValueStrategy(performance.getHighValueStrategy())
                    .lowValueStrategy(performance.getLowValueStrategy())
                    .highLossValueStrategy(performance.getHighLossValueStrategy())
                    .build();
        }

        public static BackTestingDto.BackTestingResponse of(Portfolio portfolio, TradingResult tradingResult, PerformanceResult performanceResult, List<org.dgu.backend.domain.TradingLog> tradingLogs) {
            return BackTestingResponse.builder()
                    .portfolioId(portfolio.getPortfolioId())
                    .trading(Trading.of(tradingResult))
                    .performance(Performance.of(performanceResult))
                    .tradingLogs(TradingLog.ofTradingLogs(tradingLogs))
                    .isSaved(portfolio.getIsSaved())
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Trading {
        private Long initialCapital;
        private Long finalCapital;
        private int totalTradeCount;
        private int positiveTradeCount;
        private int negativeTradeCount;
        private int averageTradePeriod;
        private Double averagePositiveTrade;
        private Double averageNegativeTrade;

        public static BackTestingDto.Trading of(TradingResult tradingResult) {
            return BackTestingDto.Trading.builder()
                    .initialCapital(tradingResult.getInitialCapital())
                    .finalCapital(tradingResult.getFinalCapital())
                    .totalTradeCount(tradingResult.getTotalTradeCount())
                    .positiveTradeCount(tradingResult.getPositiveTradeCount())
                    .negativeTradeCount(tradingResult.getNegativeTradeCount())
                    .averageTradePeriod(tradingResult.getAverageTradePeriod())
                    .averagePositiveTrade(tradingResult.getAveragePositiveTrade())
                    .averageNegativeTrade(tradingResult.getAverageNegativeTrade())
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Performance {
        private Double totalRate;
        private Double winRate;
        private Double lossRate;
        private Double winLossRatio;
        private Long highValueStrategy;
        private Long lowValueStrategy;
        private Long highLossValueStrategy;

        public static BackTestingDto.Performance of(PerformanceResult performanceResult) {
            return BackTestingDto.Performance.builder()
                    .totalRate(performanceResult.getTotalRate())
                    .winRate(performanceResult.getWinRate())
                    .lossRate(performanceResult.getLossRate())
                    .winLossRatio(performanceResult.getWinLossRatio())
                    .highValueStrategy(performanceResult.getHighValueStrategy())
                    .lowValueStrategy(performanceResult.getLowValueStrategy())
                    .highLossValueStrategy(performanceResult.getHighLossValueStrategy())
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TradingLog {
        private String type;
        private LocalDateTime date;
        private Long capital;
        private BigDecimal coin;
        private Long coinPrice;
        private Double rate;

        public static BackTestingDto.TradingLog of(BackTestingDto.BackTestingResult backTestingResult) {
            return BackTestingDto.TradingLog.builder()
                    .type(!backTestingResult.getAction().equals("BUY") ? "매도" : "매수")
                    .date(backTestingResult.getDate())
                    .capital(backTestingResult.getCapital())
                    .coinPrice(backTestingResult.getCoinPrice().longValue())
                    .coin(backTestingResult.getCoin())
                    .rate(backTestingResult.getRate())
                    .build();
        }

        public static List<BackTestingDto.TradingLog> ofTradingLogs(List<org.dgu.backend.domain.TradingLog> tradingLogs) {
            List<BackTestingDto.TradingLog> tradingLogList = new ArrayList<>();
            for (org.dgu.backend.domain.TradingLog tradingLog : tradingLogs) {
                tradingLogList.add(BackTestingDto.TradingLog.builder()
                        .type(tradingLog.getType())
                        .date(tradingLog.getDate())
                        .capital(tradingLog.getCapital())
                        .coinPrice(tradingLog.getCoinPrice())
                        .coin(tradingLog.getCoin())
                        .rate(tradingLog.getRate())
                        .build());
            }

            return tradingLogList;
        }

        public org.dgu.backend.domain.TradingLog toTradingLog(Portfolio portfolio) {
            return org.dgu.backend.domain.TradingLog.builder()
                    .portfolio(portfolio)
                    .type(type)
                    .date(date)
                    .capital(capital)
                    .coin(coin)
                    .coinPrice(coinPrice)
                    .rate(rate)
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SavingRequest {
        private UUID portfolioId;
        private String comment;
    }
}