package net.zorphy.backend.main.game.dto.stats.metrics;

import java.util.UUID;

public record LinkedGameStats<T extends Comparable<T>>(
        UUID gameId,
        T value
) {
    /**
     * Returns and updated version of {@code this} where the update is only applied if {@code newValue} is smaller than {@code this.value}
     */
    public LinkedGameStats<T> updateMin(UUID newId, T newValue) {
        return update(newId, newValue, false);
    }

    /**
     * Returns and updated version of {@code this} where the update is only applied if {@code newValue} is larger than {@code this.value}
     */
    public LinkedGameStats<T> updateMax(UUID newId, T newValue) {
        return update(newId, newValue, true);
    }

    private LinkedGameStats<T> update(UUID newId, T newValue, boolean isMax) {
        if(value == null) {
            return new LinkedGameStats<>(newId, newValue);
        }

        int comp = value.compareTo(newValue);

        if(isMax && comp < 0) {
            return new LinkedGameStats<>(
                    newId,
                    newValue
            );
        } else if(!isMax && comp > 0) {
            return new LinkedGameStats<>(
                    newId,
                    newValue
            );
        }

        return this;
    }
}