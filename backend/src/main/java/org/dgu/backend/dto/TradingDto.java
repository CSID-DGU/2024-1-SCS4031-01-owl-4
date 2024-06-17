package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.dgu.backend.domain.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
                    .startDate(startDate)
                    .endDate(endDate)
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

        public static List<TradingDto.TradingLog> ofTradingLogs(List<UserTradingLog> tradingLogs) {
            List<TradingDto.TradingLog> tradingLogList = new ArrayList<>();
            for (UserTradingLog tradingLog : tradingLogs) {
                tradingLogList.add(TradingDto.TradingLog.builder()
                        .type(!tradingLog.getType().equals("BUY") ? "매도" : "매수")
                        .date(tradingLog.getCreatedAt().minusHours(9))
                        .capital(tradingLog.getCapital())
                        .coinPrice(tradingLog.getCoinPrice().longValue())
                        .coin(tradingLog.getCoin())
                        .rate(tradingLog.getRate())
                        .build());
            }

            return tradingLogList;
        }
    }

}