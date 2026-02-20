package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoomMember;

import java.time.Instant;

public record Prompt(
        Instant createdAt,
        String message,
        GameRoomMember author
) {
}
