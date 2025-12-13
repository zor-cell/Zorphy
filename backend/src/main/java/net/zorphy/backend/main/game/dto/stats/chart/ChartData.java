package net.zorphy.backend.main.game.dto.stats.chart;

import java.util.List;

public record ChartData(
        List<ChartEntry> entries
) {
}
