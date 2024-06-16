package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.PortfolioOption;
import org.dgu.backend.domain.TradingOption;
import org.dgu.backend.domain.User;

import java.time.LocalDateTime;
import java.util.UUID;

public class TradingDto {
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AutoTradingRequest {
        private UUID portfolioId;
        private Long fund;
        private LocalDateTime startDate;
        private LocalDateTime endDate;

        public TradingOption to(User user, Portfolio portfolio, PortfolioOption portfolioOption) {
            return TradingOption.builder()
                    .user(user)
                    .portfolio(portfolio)
                    .initialCapital(fund)
                    .currentCapital(fund)
                    .tradingUnitPrice(fund / portfolioOption.getTradingUnit())
                    .tradingCount(portfolioOption.getTradingUnit())
                    .buyingCount(0)
                    .startDate(startDate)
                    .endDate(endDate)
                    .build();
        }
    }
}