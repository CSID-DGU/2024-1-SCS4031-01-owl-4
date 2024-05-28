package org.dgu.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;

public class TokenDto {
    @Builder
    @Getter
    @AllArgsConstructor
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TokenResponse {
        @JsonProperty("access_token")
        private String accessToken;

        public static TokenDto.TokenResponse of(String accessToken) {
            return TokenResponse.builder()
                    .accessToken(accessToken)
                    .build();
        }
    }
}
