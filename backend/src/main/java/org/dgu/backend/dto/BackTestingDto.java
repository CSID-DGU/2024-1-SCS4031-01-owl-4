package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class BackTestingDto {
    @Builder
    @Getter
    @NoArgsConstructor
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
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BackTestingResult {
        private LocalDateTime date;
        private String action;
        private Double coinPrice;
        private Double coin;
        private Long capital;
        private Double rate;
        private Long income;
        private Integer tradingPeriod;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EMAInfo {
        private LocalDateTime date;
        private Long price;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BackTestingResponse {
        private UUID portfolioId;
        private Trading trading;
        private Performance performance;
        private List<TradingLog> tradingLogs;

        public void addId(UUID portfolioId) {
            this.portfolioId = portfolioId;
        }
    }

    @Builder
    @Getter
    @NoArgsConstructor
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
    }

    @Builder
    @Getter
    @NoArgsConstructor
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
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TradingLog {
        private String type;
        private LocalDateTime date;
        private Long coinPrice;
        private Double rate;
    }
}