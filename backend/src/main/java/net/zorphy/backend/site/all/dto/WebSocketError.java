package net.zorphy.backend.site.all.dto;

public record WebSocketError(
        int status,
        String error
) {
}
