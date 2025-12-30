package net.zorphy.backend.site.core.ws.dto;

public record WebSocketError(
        int status,
        String error
) {
}
