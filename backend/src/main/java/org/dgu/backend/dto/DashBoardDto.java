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
}