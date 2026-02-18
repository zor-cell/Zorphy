package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.RoomMember;

public record Prompt(
        String message,
        RoomMember author
) {
}
