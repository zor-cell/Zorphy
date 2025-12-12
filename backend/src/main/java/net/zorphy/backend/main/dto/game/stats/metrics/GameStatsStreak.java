package net.zorphy.backend.main.dto.game.stats.metrics;

import net.zorphy.backend.main.dto.game.GameDetails;

import java.util.UUID;

public record GameStatsStreak(
        int streak,
        GameDetails start,
        GameDetails end,
        UUID playerId
) {
}
