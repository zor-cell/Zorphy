package net.zorphy.backend.site.jolly.dto;

import net.zorphy.backend.site.all.http.dto.TeamDetails;

public record RoundResult(
        TeamDetails team,
        int score,
        boolean hasClosed,
        boolean outInOne
) {
}
