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
        private Long account;
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserCoinResponse {
        private String coinName;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal balance;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal price;
        private Boolean isIncrease;

        public UserCoin to(User user) {
            return UserCoin.builder()
                    .user(user)
                    .coinName(coinName)
                    .balance(balance)
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
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal price;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal changePrice;
        @JsonSerialize(using = BigDecimalSerializer.class)
        private BigDecimal changeRate;
        private Boolean isIncrease;

        public static DashBoardDto.RepresentativeCoinResponse of(UpbitDto.Ticker ticker, String koreanName) {
            return RepresentativeCoinResponse.builder()
                    .marketName(ticker.getMarket())
                    .koreanName(koreanName)
                    .changePrice(BigDecimal.valueOf(ticker.getPrice()))
                    .changeRate(BigDecimal.valueOf(ticker.getChangeRate()).setScale(5, RoundingMode.HALF_UP))
                    .isIncrease(ticker.getChange().equals("RISE"))
                    .build();
        }
    }
}