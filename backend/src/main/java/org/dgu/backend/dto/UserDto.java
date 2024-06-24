package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.dgu.backend.domain.User;

public class UserDto {
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserUpbitKeyRequest {
        private String accessKey;
        private String secretKey;
    }

    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class getUserAgreementResponse {
        private Boolean isAgree;

        public static UserDto.getUserAgreementResponse of(User user) {
            return getUserAgreementResponse.builder()
                    .isAgree(user.getIsAgree())
                    .build();
        }
    }
}