package net.zorphy.backend.site.airsoft.service;

import net.zorphy.backend.site.airsoft.dto.GameRoomState;
import net.zorphy.backend.site.core.ws.dto.GameRoomMember;
import net.zorphy.backend.site.core.ws.service.GameRoomBaseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirsoftService implements GameRoomBaseService<GameRoomState> {
    @Override
    public GameRoomState createRoom(String username) {
        return null;
    }

    @Override
    public GameRoomState joinRoom(GameRoomState gameRoomState, String username) {
        return null;
    }

    @Override
    public GameRoomState leaveRoom(GameRoomState gameRoomState, String username) {
        return null;
    }

    @Override
    public GameRoomState updateMembers(GameRoomState gameRoomState, String username, List<GameRoomMember> members) {
        return null;
    }
}
