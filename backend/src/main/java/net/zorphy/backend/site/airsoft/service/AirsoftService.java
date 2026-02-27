package net.zorphy.backend.site.airsoft.service;

import net.zorphy.backend.site.airsoft.dto.GameRoomState;
import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
import net.zorphy.backend.site.core.ws.dto.GameRoom;
import net.zorphy.backend.site.core.ws.dto.GameRoomMember;
import net.zorphy.backend.site.core.ws.exception.FatalWebsocketException;
import net.zorphy.backend.site.core.ws.service.GameRoomBaseService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AirsoftService implements GameRoomBaseService<GameRoomState> {
    @Override
    public GameRoomState createRoom(String username) {
        String roomId = UUID.randomUUID().toString().substring(0, 6);

        var member = new GameRoomMember(username);
        GameRoom room = new GameRoom(
                Instant.now(),
                roomId,
                new ArrayList<>(List.of(member)),
                member
        );

        return new GameRoomState(
                room
        );
    }

    @Override
    public GameRoomState joinRoom(GameRoomState state, String username) {
        List<GameRoomMember> members = new ArrayList<>(state.room().members());
        var member = new GameRoomMember(username);

        if(state.room().members().contains(member)) {
            throw new FatalWebsocketException("Another room member with this username already exists");
        }

        //reassign host
        var host = state.room().host();
        if(members.isEmpty()) {
            host = member;
        }

        members.add(member);

        return new GameRoomState(
                new GameRoom(
                        state.room().createdAt(),
                        state.room().roomId(),
                        members,
                        host
                )
        );
    }

    @Override
    public GameRoomState leaveRoom(GameRoomState state, String username) {
        List<GameRoomMember> members = new ArrayList<>(state.room().members());
        var member = new GameRoomMember(username);

        members.remove(member);

        //pick new host after host leaves the room
        var host = state.room().host();
        if(host.equals(member)) {
            if(members.isEmpty()) {
                host = null;
            } else {
                host = members.getFirst();
            }
        }

        return new GameRoomState(
                new GameRoom(
                        state.room().createdAt(),
                        state.room().roomId(),
                        members,
                        host
                )
        );
    }

    @Override
    public GameRoomState updateMembers(GameRoomState state, String username, List<GameRoomMember> members) {
        if(!state.room().host().username().equals(username)) {
            throw new InvalidOperationException("Only the host can update room members");
        }

        state.room().members().clear();
        state.room().members().addAll(members);

        return state;
    }
}
