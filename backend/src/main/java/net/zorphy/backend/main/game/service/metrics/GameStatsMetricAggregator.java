package net.zorphy.backend.main.game.service.metrics;

import net.zorphy.backend.main.game.dto.stats.metrics.GameStatsMetrics;
import net.zorphy.backend.main.game.dto.stats.metrics.LinkedGameStats;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * A class that provides functionality to aggregate data to compute relevant statistics metrics
 */
public class GameStatsMetricAggregator<T extends Comparable<T>> {
    private final MetricArithmeticStrategy<T> arithmetic;
    private LinkedGameStats<T> min = new LinkedGameStats<>(null, null);
    private LinkedGameStats<T> max = new LinkedGameStats<>(null, null);
    private final List<T> entries = new ArrayList<>();

    public GameStatsMetricAggregator(MetricArithmeticStrategy<T> arithmetic) {
        this.arithmetic = arithmetic;
    }

    /**
     * Updates the internal stats with a {@code newValue}
     */
    public void update(UUID gameId, T newValue) {
        entries.add(newValue);
        min = min.updateMin(gameId, newValue);
        max = max.updateMax(gameId, newValue);
    }

    /**
     * Returns all aggregated statistics
     */
    public GameStatsMetrics<T> aggregate() {
        T total = entries.stream().reduce(arithmetic.getDefault(), arithmetic::add);
        T avg = arithmetic.divide(total, entries.size());

        entries.sort(T::compareTo);

        T median;
        if (entries.isEmpty()) {
            median = arithmetic.getDefault();
        } else {
            int mid = entries.size() / 2;
            if (entries.size() % 2 == 1) {
                median = entries.get(mid);
            } else {
                T left = entries.get(mid - 1);
                T right = entries.get(mid);

                T sum = arithmetic.add(left, right);
                median = arithmetic.divide(sum, 2);
            }
        }

        return new GameStatsMetrics<>(
                min,
                max,
                avg,
                median
        );
    }
}
