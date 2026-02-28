package net.zorphy.backend.site.airsoft.dto;

public record GeoLocation(
        long timestamp,
        double latitude,
        double longitude,
        double accuracy,
        double heading
) {
}
