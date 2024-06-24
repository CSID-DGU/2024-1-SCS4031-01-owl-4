package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.dgu.backend.util.BigDecimalSerializer;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;

public class ChartDto {
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class OHLCVResponse {
        private String date;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal openingPrice;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal highPrice;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal lowPrice;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal closePrice;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal volume;

        public static OHLCVResponse of(CandleInfo candleInfo) {
            return OHLCVResponse.builder()
                    .date(String.valueOf(candleInfo.getDateTime()))
                    .openingPrice(BigDecimal.valueOf(candleInfo.getOpeningPrice()))
                    .lowPrice(BigDecimal.valueOf(candleInfo.getLowPrice()))
                    .highPrice(BigDecimal.valueOf(candleInfo.getHighPrice()))
                    .closePrice(BigDecimal.valueOf(candleInfo.getTradePrice()))
                    .volume(BigDecimal.valueOf(candleInfo.getAccTradeVolume()).setScale(3, RoundingMode.HALF_UP))
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class OHLCResponse {
        private String date;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal openingPrice;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal highPrice;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal lowPrice;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal closePrice;

        public static java.util.List<OHLCResponse> ofOHLCResponses(java.util.List<OHLCVResponse> ohlcvResponses) {
            java.util.List<OHLCResponse> ohlcResponses = new ArrayList<>();
            for (OHLCVResponse ohlcvResponse : ohlcvResponses) {
                ohlcResponses.add(OHLCResponse.builder()
                        .date(ohlcvResponse.getDate())
                        .openingPrice(ohlcvResponse.getOpeningPrice())
                        .highPrice(ohlcvResponse.getHighPrice())
                        .lowPrice(ohlcvResponse.getLowPrice())
                        .closePrice(ohlcvResponse.getClosePrice())
                        .build());
            }

            return ohlcResponses;
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class VResponse {
        private String date;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal volume;

        public static java.util.List<VResponse> ofVResponses(java.util.List<OHLCVResponse> ohlcvResponses) {
            java.util.List<VResponse> vResponses = new ArrayList<>();
            for (OHLCVResponse ohlcvResponse : ohlcvResponses) {
                vResponses.add(VResponse.builder()
                        .date(ohlcvResponse.getDate())
                        .volume(ohlcvResponse.getVolume())
                        .build());
            }

            return vResponses;
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ChartOptionResponse {
        private String englishName;
        private String koreanName;
        private String marketName;
        private String candleName;
        private String candleKoreanName;

        public static ChartOptionResponse of(Market market, Candle candle) {
            return ChartOptionResponse.builder()
                    .englishName(market.getEnglishName())
                    .koreanName(market.getKoreanName())
                    .marketName(market.getMarketName())
                    .candleName(candle.getCandleName())
                    .candleKoreanName(candle.getKoreanName())
                    .build();
        }
    }
}