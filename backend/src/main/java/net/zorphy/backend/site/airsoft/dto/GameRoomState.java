package net.zorphy.backend.site.airsoft.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoom;
import net.zorphy.backend.site.core.ws.dto.GameRoomPrivateStateBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;

public record GameRoomState(
        GameRoom room
) implements GameRoomStateBase {
    @Override
    public GameRoomStateBase toPublicState() {
        return this;
    }

    @Override
    public GameRoomPrivateStateBase toPrivateState(String username) {
        return new GameRoomPrivateState();
    }
}
