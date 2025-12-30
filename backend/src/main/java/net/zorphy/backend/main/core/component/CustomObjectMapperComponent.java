package net.zorphy.backend.main.core.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;

@Component
public class CustomObjectMapperComponent {
    private final ObjectMapper objectMapper;

    public CustomObjectMapperComponent(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;

        JavaTimeModule module = new JavaTimeModule();
        this.objectMapper.registerModule(module);

        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public ObjectMapper getMapper() {
        return objectMapper;
    }
}
