package net.zorphy.backend.site.all.ws.dto;

public record WebSocketError(
        int status,
        String error
) {
}
