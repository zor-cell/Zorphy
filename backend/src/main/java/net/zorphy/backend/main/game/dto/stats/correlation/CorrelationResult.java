package net.zorphy.backend.main.game.dto.stats.correlation;

import java.util.List;

public record CorrelationResult(
        CorrelationMetadata metadata,
        double coefficient,
        double slope,
        double intercept,
        List<CorrelationDataPoint> points
) {
}
