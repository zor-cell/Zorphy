package net.zorphy.backend.site.nobodysperfect.service;

import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
import net.zorphy.backend.site.core.ws.dto.GameRoomMember;
import net.zorphy.backend.site.core.ws.service.GameRoomBaseService;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoom;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoomState;
import net.zorphy.backend.site.nobodysperfect.dto.Prompt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class NobodyIsPerfectService implements GameRoomBaseService<GameRoom, GameRoomState> {
    public NobodyIsPerfectService() { }

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
                room,
                member,
                new ArrayList<>()
        );
    }

    @Override
    public GameRoomState joinRoom(GameRoomState state, String username) {
        var member = new GameRoomMember(username);

        if(state.room().members().contains(member)) {
            throw new InvalidOperationException("Member with this username already exists");
        }

        state.room().members().add(member);

        return state;
    }

    @Override
    public GameRoomState leaveRoom(GameRoomState state, String username) {
        var member = new GameRoomMember(username);

        state.room().members().remove(member);

        return state;
    }

    @Override
    public GameRoomState updateMembers(GameRoomState state, String username, List<GameRoomMember> members) {
        if(!state.room().host().username().equals(username)) {
            throw new InvalidOperationException("Only the host can reorder room members");
        }

        state.room().members().clear();
        state.room().members().addAll(members);

        return state;
    }

    public GameRoomState addPrompt(GameRoomState state, String username, String message) {
        GameRoomMember member = new GameRoomMember(username);
        Prompt prompt = new Prompt(message, member);

        state.prompts().add(prompt);

        return state;
    }
}
