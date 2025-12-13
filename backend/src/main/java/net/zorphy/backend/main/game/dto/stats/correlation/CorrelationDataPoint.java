package net.zorphy.backend.main.game.dto.stats.correlation;

public record CorrelationDataPoint(
        double x,
        double y,
        boolean isWinner
) {
}
