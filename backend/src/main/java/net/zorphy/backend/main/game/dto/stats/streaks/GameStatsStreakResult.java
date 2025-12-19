package net.zorphy.backend.main.game.dto.stats.streaks;

public record GameStatsStreakResult(
        GameStatsStreak currentStreak,
        GameStatsStreak maxStreak
) {}
