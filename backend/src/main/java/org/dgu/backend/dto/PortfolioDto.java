package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.dgu.backend.domain.Portfolio;

import java.util.UUID;

public class PortfolioDto {
    @Builder
    @Getter
    @NoArgsConstructor
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
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PortfolioDetailInfos {
        private String description;
        private String comment;
        private BackTestingDto.Trading trading;
        private BackTestingDto.Performance performance;
    }

    @Builder
    @Getter
    @NoArgsConstructor
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
    @NoArgsConstructor
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
}