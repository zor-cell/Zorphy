package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;

public record GameRoomState(
        GameRoom room
) implements GameRoomStateBase {
}
