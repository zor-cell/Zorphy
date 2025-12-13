package net.zorphy.backend.main.game.dto.stats.metrics;

public record GameStatsMetrics<T extends Comparable<T>>(
        LinkedGameStats<T> min,
        LinkedGameStats<T> max,
        T avg,
        T median
) {
}
