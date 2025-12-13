package net.zorphy.backend.site.catan.dto.game;

import net.zorphy.backend.main.game.dto.stats.GameSpecificStats;
import net.zorphy.backend.main.game.dto.stats.metrics.GameStatsMetrics;
import net.zorphy.backend.site.catan.dto.DiceRoll;

import java.time.Duration;
import java.util.List;


public record GameStats(
        int gameCount,
        double luckMetric,
        GameStatsMetrics<Duration> rollDurationMetrics,
        List<DiceRoll> diceRolls
) implements GameSpecificStats {
}
