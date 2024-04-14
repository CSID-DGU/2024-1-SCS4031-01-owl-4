package org.dgu.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MarketResponse {
    @JsonProperty("market")
    private String name;

    @JsonProperty("korean_name")
    private String koreanName;

    @JsonProperty("english_name")
    private String englishName;
}
