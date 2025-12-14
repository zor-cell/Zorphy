package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.all.ws.dto.GameRoomBase;
import net.zorphy.backend.site.all.ws.dto.GameRoomStateBase;

public record GameRoomState(
        GameRoomBase room
) implements GameRoomStateBase {
}
