package net.zorphy.backend.main.game.dto.stats.streaks;


import java.time.Instant;

public record GameStatsStreak(
        int streak,
        Instant start,
        Instant end
) {
}
