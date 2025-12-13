package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.main.game.dto.stats.GameSpecificStats;
import net.zorphy.backend.main.game.dto.stats.metrics.GameStatsMetrics;

import java.time.Duration;


public record GameStats(
        int roundsPlayed,
        double roundWinRate,
        GameStatsMetrics<Double> roundScoreMetrics,
        GameStatsMetrics<Duration> roundDurationMetrics,
        double outInOneRate,
        double closedRate
) implements GameSpecificStats {
}
