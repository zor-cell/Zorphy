package net.zorphy.backend.site.all.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.all.exception.InvalidSessionException;
import net.zorphy.backend.site.all.dto.GameRoom;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class WebSocketBaseService {
    private static final String ROOM_KEY_PREFIX = "rooms:";

    private final String applicationNamespace;
    private final StringRedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper mapper;

    public  WebSocketBaseService(StringRedisTemplate redisTemplate,
                                 SimpMessagingTemplate messagingTemplate,
                                 @Qualifier("redisObjectMapper") ObjectMapper mapper,
                                 @Value("${spring.session.redis.namespace}") String applicationNamespace
    ) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
        this.mapper = mapper;
        this.applicationNamespace = applicationNamespace;
    }

    public GameRoom createRoom(String sessionId) {
        String roomId = UUID.randomUUID().toString();

        GameRoom room = new GameRoom(
                roomId,
                new ArrayList<>(List.of(sessionId))
        );

        setRoom(room);

        return room;
    }

    public GameRoom joinRoom(String sessionId, String roomId) {
        GameRoom room = getRoom(roomId);
        room.members().add(sessionId);
        setRoom(room);

        messagingTemplate.convertAndSend("/topic/join", "Someone joined!");

        return room;
    }

    private GameRoom getRoom(String roomId) {
        String roomKey = getRoomKey(roomId);

        try {
            String roomJson = redisTemplate.opsForValue().get(roomKey);
            if(roomJson == null) {
                throw new InvalidSessionException("Room does not exist");
            }

            return mapper.readValue(roomJson, GameRoom.class);
        } catch (JsonProcessingException e) {
            throw new InvalidSessionException("Could not parse room");
        }
    }

    private void setRoom(GameRoom room) {
        String roomKey = getRoomKey(room.roomId());

        try {
            String value = mapper.writeValueAsString(room);

            redisTemplate.opsForValue().set(roomKey, value);
        } catch (JsonProcessingException e) {
            throw new InvalidSessionException("Could not parse room");
        }
    }

    private String getRoomKey(String roomId) {
        return applicationNamespace + ":" + ROOM_KEY_PREFIX + roomId;
    }

}
