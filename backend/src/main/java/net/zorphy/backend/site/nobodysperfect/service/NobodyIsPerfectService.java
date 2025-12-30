package net.zorphy.backend.site.nobodysperfect.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.site.core.ws.dto.RoomMember;
import net.zorphy.backend.site.core.ws.service.GameRoomBaseService;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoom;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoomState;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class NobodyIsPerfectService implements GameRoomBaseService<GameRoom, GameRoomState> {
    public NobodyIsPerfectService(
            StringRedisTemplate redisTemplate,
            SimpMessagingTemplate messagingTemplate,
            ObjectMapper mapper) {

    }

    @Override
    public GameRoomState createRoom(String sessionId) {
        String roomId = UUID.randomUUID().toString();

        var member = new RoomMember(
                sessionId,
                "username"
        );
        GameRoom room = new GameRoom(
                Instant.now(),
                roomId,
                new ArrayList<>(List.of(member))
        );

        return new GameRoomState(room);
    }

    @Override
    public GameRoomState joinRoom(GameRoomState state, String sessionId) {
        var member = new RoomMember(sessionId, "username");
        state.room().members().add(member);

        return new GameRoomState(
                state.room()
        );
    }
}
