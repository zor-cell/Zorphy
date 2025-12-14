package net.zorphy.backend.site.all.dto.ws;

public record WebSocketError(
        int status,
        String error
) {
}
