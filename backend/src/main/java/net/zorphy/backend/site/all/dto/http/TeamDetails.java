package net.zorphy.backend.site.all.dto.http;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import net.zorphy.backend.main.player.dto.PlayerDetails;

import java.util.List;

public record TeamDetails(
        @NotBlank
        String name,

        @NotEmpty
        @Valid
        List<PlayerDetails> players
) {
}
