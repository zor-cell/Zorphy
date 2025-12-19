package net.zorphy.backend.main.game.dto.stats;

import net.zorphy.backend.main.game.dto.stats.chart.ChartData;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationResult;
import net.zorphy.backend.main.game.dto.stats.metrics.GameStatsMetrics;
import net.zorphy.backend.main.game.dto.stats.streaks.GameStatsStreakResult;
import net.zorphy.backend.main.player.dto.PlayerDetails;

import java.time.Duration;
import java.util.List;


public record GameStats(
        PlayerDetails player,
        int gamesPlayed,
        double winRate,
        GameStatsStreakResult winStreaks,
        GameStatsMetrics<Double> scoreMetrics,
        GameStatsMetrics<Duration> durationMetrics,
        PlayerDetails nemesis,
        PlayerDetails victim,
        PlayerDetails rival,
        PlayerDetails companion,
        List<CorrelationResult> correlations,
        List<ChartData> chartData,
        GameSpecificStats gameSpecific
) {
}
