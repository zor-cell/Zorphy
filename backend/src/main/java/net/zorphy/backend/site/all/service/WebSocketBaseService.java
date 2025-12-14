package net.zorphy.backend.site.all.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.all.exception.InvalidSessionException;
import net.zorphy.backend.site.all.dto.GameRoom;
import net.zorphy.backend.site.all.dto.WebSocketError;
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
    private static final String SESSION_USERNAME_KEY = "SESSION_USERNAME";

    private final String applicationNamespace;
    private final StringRedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper mapper;

    public WebSocketBaseService(StringRedisTemplate redisTemplate,
                                 SimpMessagingTemplate messagingTemplate,
                                 ObjectMapper mapper,
                                 @Value("${spring.session.redis.namespace}") String applicationNamespace
    ) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
        this.mapper = mapper;
        this.applicationNamespace = applicationNamespace;
    }

    public void createRoom(String sessionId) {
        String roomId = UUID.randomUUID().toString();

        GameRoom room = new GameRoom(
                roomId,
                new ArrayList<>(List.of(sessionId))
        );

        setRoom(room);

        //TODO this sending does not work
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/nobody-is-perfect/created", room);

        messagingTemplate.convertAndSend("/topic/test", "test message");
    }

    public void joinRoom(String sessionId, String roomId) {
        GameRoom room = getRoom(roomId);
        room.members().add(sessionId);
        setRoom(room);

        messagingTemplate.convertAndSend("/topic/join", "Someone joined!");

        messagingTemplate.convertAndSendToUser(sessionId, "/user/queue/nobody-is-perfect/joined", room);
    }

    public void handleError(String sessionId, Exception ex) {
        var error = new WebSocketError(
                400,
                ex.getMessage()
        );

        messagingTemplate.convertAndSendToUser(sessionId, "/user/queue/nobody-is-perfect/joined", error);
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
