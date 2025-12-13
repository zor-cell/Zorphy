package net.zorphy.backend.main.game.dto.stats.chart;

import java.time.Instant;

public record ChartEntry(
        Instant date,
        int score,
        boolean won
) {
}
