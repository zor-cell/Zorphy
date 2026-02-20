package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoomMember;

public record Prompt(
        String message,
        GameRoomMember author
) {
}
