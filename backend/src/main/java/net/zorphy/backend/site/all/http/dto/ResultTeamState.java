package net.zorphy.backend.site.all.http.dto;

import jakarta.validation.Valid;

public record ResultTeamState(
        @Valid
        TeamDetails team,
        int score
) {
}
