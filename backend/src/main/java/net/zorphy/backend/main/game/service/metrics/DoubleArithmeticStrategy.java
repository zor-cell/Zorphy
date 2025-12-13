package net.zorphy.backend.main.game.service.metrics;


public class DoubleArithmeticStrategy extends MetricArithmeticStrategy<Double> {
    @Override
    public Double getDefault() {
        return 0.0;
    }

    @Override
    public Double add(Double a, Double b) {
        return a + b;
    }

    @Override
    public Double unsafeDivide(Double value, int divisor) {
        return value / divisor;
    }
}
