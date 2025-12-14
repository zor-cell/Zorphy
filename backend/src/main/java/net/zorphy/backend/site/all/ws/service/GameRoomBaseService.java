package net.zorphy.backend.site.all.ws.service;

import net.zorphy.backend.site.all.ws.dto.GameRoomBase;
import net.zorphy.backend.site.all.ws.dto.GameRoomStateBase;

public interface GameRoomBaseService<Room extends GameRoomBase, State extends GameRoomStateBase> {
    State createRoom(String sessionId);

    State joinRoom(State state, String sessionId);
}
