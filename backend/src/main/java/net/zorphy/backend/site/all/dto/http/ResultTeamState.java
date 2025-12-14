package net.zorphy.backend.site.all.dto.http;

import jakarta.validation.Valid;

public record ResultTeamState(
        @Valid
        TeamDetails team,
        int score
) {
}
