package net.zorphy.backend.main.game.dto.stats.correlation;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CorrelationAxisType {
    TIME,
    LINEAR,
    LOGARITHMIC,
    CATEGORY,
    TIMESERIES,
    RADIALLINEAR;

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }

    @JsonCreator
    public static CorrelationAxisType fromValue(String value) {
        return CorrelationAxisType.valueOf(value.toUpperCase());
    }
}
