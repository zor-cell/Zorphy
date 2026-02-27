package net.zorphy.backend.config.http;

import net.zorphy.backend.config.property.FileStorageProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class WebConfig implements WebMvcConfigurer {
    private final FileStorageProperty fileStorageProperty;

    public WebConfig(FileStorageProperty fileStorageProperty) {
        this.fileStorageProperty = fileStorageProperty;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost", "http://localhost:4200", "https://zorphy.net")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path dir = Paths.get(fileStorageProperty.getDirectory()).toAbsolutePath().normalize();

        registry.addResourceHandler("files/**")
                .addResourceLocations("file:" + dir);
    }
}