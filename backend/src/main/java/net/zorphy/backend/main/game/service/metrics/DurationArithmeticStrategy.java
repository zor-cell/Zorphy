package net.zorphy.backend.main.game.service.metrics;

import java.time.Duration;

public class DurationArithmeticStrategy extends MetricArithmeticStrategy<Duration> {
    @Override
    public Duration getDefault() {
        return Duration.ZERO;
    }

    @Override
    public Duration add(Duration a, Duration b) {
        return a.plus(b);
    }

    @Override
    public Duration unsafeDivide(Duration value, int divisor) {
        return value.dividedBy(divisor);
    }
}
