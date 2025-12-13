package net.zorphy.backend.site.all.dto;

import jakarta.validation.Valid;
import net.zorphy.backend.main.player.dto.TeamDetails;

public record ResultTeamState(
        @Valid
        TeamDetails team,
        int score
) {
}
