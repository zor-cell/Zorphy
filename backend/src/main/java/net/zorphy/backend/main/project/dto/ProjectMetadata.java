package net.zorphy.backend.main.project.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.URL;

import java.time.Instant;

public record ProjectMetadata(
        @NotBlank
        String name,

        @NotNull
        Instant createdAt,

        @NotBlank
        String title,

        @NotBlank
        String description,

        @Nullable
        String imagePath,

        @Nullable
        @URL
        String githubUrl,

        @NotNull
        Boolean hasWebsite,

        @NotNull
        Boolean isFavorite
) {
}
