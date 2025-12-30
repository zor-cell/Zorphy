package net.zorphy.backend.site.jolly.dto;

import net.zorphy.backend.site.core.http.dto.TeamDetails;

public record RoundResult(
        TeamDetails team,
        int score,
        boolean hasClosed,
        boolean outInOne
) {
}
