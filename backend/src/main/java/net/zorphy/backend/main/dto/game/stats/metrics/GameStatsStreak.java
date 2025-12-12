package net.zorphy.backend.main.dto.game.stats.metrics;

import net.zorphy.backend.main.entity.Game;

public record GameStatsStreak(
        int streak,
        Game start,
        Game end
) {
}
