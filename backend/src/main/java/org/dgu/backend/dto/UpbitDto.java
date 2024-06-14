package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;
import org.dgu.backend.domain.Market;

import java.math.BigDecimal;

public class UpbitDto {
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MarketResponse {
        @JsonProperty("market")
        private String name;

        @JsonProperty("korean_name")
        private String koreanName;

        @JsonProperty("english_name")
        private String englishName;

        public Market to() {
            return Market.builder()
                    .marketName(name)
                    .koreanName(koreanName)
                    .englishName(englishName)
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CandleInfoResponse {
        @JsonProperty("market")
        private String marketName;

        @JsonProperty("candle_date_time_kst")
        private String dateTime;

        @JsonProperty("opening_price")
        private Double openingPrice;

        @JsonProperty("high_price")
        private Double highPrice;

        @JsonProperty("low_price")
        private Double lowPrice;

        @JsonProperty("trade_price")
        private Double tradePrice;

        @JsonProperty("timestamp")
        private Long timestamp;

        @JsonProperty("candle_acc_trade_price")
        private Double accTradePrice;

        @JsonProperty("candle_acc_trade_volume")
        private Double accTradeVolume;

        @JsonProperty("prev_closing_price")
        private Double prevClosingPrice;

        @JsonProperty("change_price")
        private Double changePrice;

        @JsonProperty("change_rate")
        private Double changeRate;
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Account {
        private String currency;
        @JsonProperty("balance")
        private BigDecimal coinCount;
        private BigDecimal locked;
        private BigDecimal avgBuyPrice;
        private String unitCurrency;
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Ticker {
        private String market;
        @JsonProperty("trade_price")
        private Double price;
        private String change;
        @JsonProperty("signed_change_rate")
        private Double changeRate;
        @JsonProperty("signed_change_price")
        private Double changePrice;
    }
}
