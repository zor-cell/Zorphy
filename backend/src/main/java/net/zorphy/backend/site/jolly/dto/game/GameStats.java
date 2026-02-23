package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.main.game.dto.stats.GameSpecificStats;
import net.zorphy.backend.main.game.dto.stats.metrics.GameStatsMetrics;
import net.zorphy.backend.main.game.dto.stats.streaks.GameStatsStreak;

import java.time.Duration;


public record GameStats(
        int roundsPlayed,
        double roundWinRate,
        GameStatsMetrics<Double> roundsMetrics,
        GameStatsMetrics<Double> roundScoreMetrics,
        GameStatsMetrics<Duration> roundDurationMetrics,
        double outInOneRate,
        double closedRate,
        GameStatsStreak maxOutInOneStreak,
        GameStatsStreak maxClosedStreak,
        double jokersPerRound
) implements GameSpecificStats {
}
