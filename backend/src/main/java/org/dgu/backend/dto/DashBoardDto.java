package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.dgu.backend.domain.User;
import org.dgu.backend.domain.UserCoin;
import org.dgu.backend.util.BigDecimalSerializer;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class DashBoardDto {
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserAccountResponse {
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal account;
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserCoinResponse {
        private String marketName;
        private String koreanName;
        private String englishName;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal coinCount;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal price;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal balance;
        private Boolean isIncrease;
        private BigDecimal rate;

        public UserCoin to(User user) {
            return UserCoin.builder()
                    .user(user)
                    .marketName(marketName)
                    .koreanName(koreanName)
                    .englishName(englishName)
                    .coinCount(coinCount)
                    .price(price)
                    .balance(balance)
                    .rate(rate)
                    .build();
        }
    }
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RepresentativeCoinResponse {
        private String marketName;
        private String koreanName;
        private String englishName;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal price;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal changePrice;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal changeRate;
        private Boolean isIncrease;

        public static DashBoardDto.RepresentativeCoinResponse of(UpbitDto.Ticker ticker, String koreanName, String englishName) {
            return RepresentativeCoinResponse.builder()
                    .marketName(ticker.getMarket())
                    .koreanName(koreanName)
                    .englishName(englishName)
                    .changePrice(BigDecimal.valueOf(ticker.getPrice()))
                    .changeRate(BigDecimal.valueOf(ticker.getChangeRate()).setScale(5, RoundingMode.HALF_UP))
                    .isIncrease(ticker.getChange().equals("RISE"))
                    .build();
        }
    }
}