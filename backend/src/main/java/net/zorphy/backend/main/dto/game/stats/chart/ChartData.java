package net.zorphy.backend.main.dto.game.stats.chart;

import java.util.List;

public record ChartData(
        List<ChartEntry> entries
) {
}
