package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.all.dto.ws.GameRoomBase;
import net.zorphy.backend.site.all.dto.ws.GameStateBase;

public record GameState(
        GameRoomBase room
) implements GameStateBase {
}
