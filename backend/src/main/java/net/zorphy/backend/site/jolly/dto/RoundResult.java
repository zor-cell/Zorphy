package net.zorphy.backend.site.jolly.dto;

import net.zorphy.backend.main.player.dto.TeamDetails;

public record RoundResult(
        TeamDetails team,
        int score,
        boolean hasClosed,
        boolean outInOne
) {
}
