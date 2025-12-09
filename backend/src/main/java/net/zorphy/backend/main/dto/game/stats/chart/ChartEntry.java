package net.zorphy.backend.main.dto.game.stats.chart;

import java.time.Instant;

public record ChartEntry(
        Instant date,
        int score,
        boolean won
) {
}
