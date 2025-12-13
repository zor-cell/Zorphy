package net.zorphy.backend.main.game.service.metrics;

public abstract class MetricArithmeticStrategy<T> {
    abstract T getDefault();
    abstract T add(T a, T b);
    abstract T unsafeDivide(T value, int divisor);

    /**
     * Divides the {@code value} by the given {@code divisor}.
     * Returns 0 if the {@code divisor} is 0.
     */
    T divide(T value, int divisor) {
        if(divisor == 0){
            return getDefault();
        }

        return unsafeDivide(value, divisor);
    }
}
