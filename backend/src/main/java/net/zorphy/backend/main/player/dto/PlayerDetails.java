package net.zorphy.backend.main.player.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record PlayerDetails(
        UUID id,
        @NotBlank
        String name
) {
}
