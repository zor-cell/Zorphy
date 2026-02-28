package net.zorphy.backend.site.airsoft.dto;

public record PlayerGeoLocation(
        String username,
        GeoLocation location
) {
}
