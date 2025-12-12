package net.zorphy.backend.main.dto.game.stats;

import net.zorphy.backend.main.dto.game.stats.chart.ChartData;
import net.zorphy.backend.main.dto.game.stats.correlation.CorrelationResult;
import net.zorphy.backend.main.dto.game.stats.metrics.GameStatsMetrics;
import net.zorphy.backend.main.dto.game.stats.metrics.GameStatsStreak;
import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.time.Duration;
import java.util.List;


public record GameStats(
        PlayerDetails player,
        int gamesPlayed,
        double winRate,
        GameStatsStreak currentWinStreak,
        GameStatsStreak maxWinStreak,
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
