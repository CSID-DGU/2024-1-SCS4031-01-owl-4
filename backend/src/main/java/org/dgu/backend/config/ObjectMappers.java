package org.dgu.backend.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Locale;
import java.util.TimeZone;

@Configuration
public class ObjectMappers {

    public static final String BEAN_NAME_OBJECT_MAPPER = "restTemplateObjectMapper";

    @Bean(BEAN_NAME_OBJECT_MAPPER)
    public ObjectMapper restTemplateObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.setTimeZone(TimeZone.getDefault());
        objectMapper.setLocale(Locale.getDefault());
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }
}