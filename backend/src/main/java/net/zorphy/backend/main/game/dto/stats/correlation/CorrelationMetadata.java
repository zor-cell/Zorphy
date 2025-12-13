package net.zorphy.backend.main.game.dto.stats.correlation;

public record CorrelationMetadata(
        String title,
        String xAxisTitle,
        String yAxisTitle,
        CorrelationAxisType xAxisType
) {
}
