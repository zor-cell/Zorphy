package net.zorphy.backend.site.core.ws.service;

import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomMember;

import java.util.List;

public interface GameRoomBaseService<State extends GameRoomStateBase> {
    State createRoom(String username);

    State joinRoom(State state, String username);

    State leaveRoom(State state, String username);

    State updateMembers(State state, String username, List<GameRoomMember> members);
}
