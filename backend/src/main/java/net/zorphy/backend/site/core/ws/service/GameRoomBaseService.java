package net.zorphy.backend.site.core.ws.service;

import net.zorphy.backend.site.core.ws.dto.GameRoomBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.core.ws.dto.RoomMember;

import java.util.List;

public interface GameRoomBaseService<Room extends GameRoomBase, State extends GameRoomStateBase> {
    State createRoom(String username);

    State joinRoom(State state, String username);

    State leaveRoom(State state, String username);

    State updateMembers(State state, String username, List<RoomMember> members);
}
