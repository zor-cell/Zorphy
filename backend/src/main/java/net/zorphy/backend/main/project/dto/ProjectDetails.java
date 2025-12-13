package net.zorphy.backend.main.project.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProjectDetails(
        @NotNull
        @Valid
        ProjectMetadata metadata,

        String content,

        @NotBlank
        String filePath
) {
}
