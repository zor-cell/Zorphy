package net.zorphy.backend.main.game.dto.stats.streaks;

import net.zorphy.backend.main.game.dto.GameDetails;

import java.util.UUID;

public record GameStatsStreak(
        int streak,
        GameDetails start,
        GameDetails end,
        UUID playerId
) {
}
