package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.dgu.backend.domain.PerformanceResult;
import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.PortfolioOption;
import org.dgu.backend.domain.TradingResult;

import java.util.Objects;
import java.util.UUID;

public class PortfolioDto {
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PortfolioInfos {
        private UUID portfolioId;
        private String title;
        private String startDate;
        private String endDate;
        private String candleName;
        private boolean isTrade;

        public static PortfolioDto.PortfolioInfos of(Portfolio portfolio, PortfolioOption portfolioOption, UUID currentPortfolioId) {
            return PortfolioDto.PortfolioInfos.builder()
                    .portfolioId(portfolio.getPortfolioId())
                    .title(portfolio.getTitle())
                    .startDate(String.valueOf(portfolioOption.getStartDate()))
                    .endDate(String.valueOf(portfolioOption.getEndDate()))
                    .candleName(portfolioOption.getCandleName())
                    .isTrade(Objects.equals(portfolio.getPortfolioId(), currentPortfolioId))
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PortfolioDetailInfos {
        private String description;
        private String comment;
        private BackTestingDto.Trading trading;
        private BackTestingDto.Performance performance;
        private Option option;

        public static PortfolioDto.PortfolioDetailInfos of(Portfolio portfolio, TradingResult tradingResult, PerformanceResult performanceResult, PortfolioOption portfolioOption) {
            return PortfolioDetailInfos.builder()
                    .description(portfolio.getDescription())
                    .comment(portfolio.getComment())
                    .trading(BackTestingDto.Trading.of(tradingResult))
                    .performance(BackTestingDto.Performance.of(performanceResult))
                    .option(PortfolioDto.Option.of(portfolioOption))
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EditPortfolioRequest {
        private String portfolioId;
        private String title;
        private String description;
        private String comment;
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EditPortfolioResponse {
        private String title;
        private String description;
        private String comment;

        public static PortfolioDto.EditPortfolioResponse of(Portfolio portfolio) {
            return EditPortfolioResponse.builder()
                    .title(portfolio.getTitle())
                    .description(portfolio.getDescription())
                    .comment(portfolio.getComment())
                    .build();
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Option {
        private int nDate;
        private int mDate;
        private int tradingUnit;
        private Double buyingPoint;
        private Double sellingPoint;
        private Double stopLossPoint;

        public static PortfolioDto.Option of(org.dgu.backend.domain.PortfolioOption portfolioOption) {
            return Option.builder()
                    .nDate(portfolioOption.getNDate())
                    .mDate(portfolioOption.getMDate())
                    .tradingUnit(portfolioOption.getTradingUnit())
                    .buyingPoint(portfolioOption.getBuyingPoint())
                    .sellingPoint(portfolioOption.getSellingPoint())
                    .stopLossPoint(portfolioOption.getStopLossPoint())
                    .build();
        }
    }
}