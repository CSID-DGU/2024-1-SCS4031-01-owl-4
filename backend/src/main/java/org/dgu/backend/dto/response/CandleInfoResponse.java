package org.dgu.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CandleInfoResponse {
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