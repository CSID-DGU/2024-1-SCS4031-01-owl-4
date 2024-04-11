package org.dgu.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class HttpClientConfig {

    public static final long CONNECT_TIMEOUT_SECONDS = 1L;
    public static final long READ_TIMEOUT_SECONDS = 5L;
    public static final String BEAN_NAME_OBJECT_MAPPER = "restTemplateObjectMapper";

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder,
                                     @Qualifier(BEAN_NAME_OBJECT_MAPPER) ObjectMapper restTemplateObjectMapper) {
        return builder
                .additionalMessageConverters(new MappingJackson2HttpMessageConverter(restTemplateObjectMapper))
                .setConnectTimeout(Duration.ofSeconds(CONNECT_TIMEOUT_SECONDS))
                .setReadTimeout(Duration.ofSeconds(READ_TIMEOUT_SECONDS))
                .build();
    }
}