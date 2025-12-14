package net.zorphy.backend.site.all.ws.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.all.exception.InvalidSessionException;
import net.zorphy.backend.site.all.ws.dto.GameRoomBase;
import net.zorphy.backend.site.all.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.all.ws.dto.WebSocketError;
import net.zorphy.backend.site.all.ws.service.GameRoomBaseService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Map;

public abstract class GameRoomBaseController<Room extends GameRoomBase, State extends GameRoomStateBase> {
    private static final String REDIS_NAMESPACE = "zorphy";
    private static final String REDIS_ROOM_NAMESPACE = "rooms:";
    private static final String SESSION_USERNAME_KEY = "SESSION_USERNAME";

    private final GameRoomBaseService<Room, State> roomBaseService;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper mapper;
    protected final SimpMessagingTemplate messagingTemplate;

    public GameRoomBaseController(
           GameRoomBaseService<Room, State> roomBaseService,
           SimpMessagingTemplate messagingTemplate,
           StringRedisTemplate redisTemplate,
           ObjectMapper mapper
    ) {
        this.roomBaseService = roomBaseService;
        this.messagingTemplate = messagingTemplate;
        this.redisTemplate = redisTemplate;
        this.mapper = mapper;
    }

    @MessageMapping("create")
    public void createRoom(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        var user = headerAccessor.getUser();

        State state = roomBaseService.createRoom(sessionId);
        setRoomState(state);

        messagingTemplate.convertAndSendToUser(user.getName(),
                "/queue/created",
                state,
                Map.of(SimpMessageHeaderAccessor.SESSION_ID_HEADER, sessionId)
        );
    }

    @MessageMapping("join/{roomId}")
    public void joinRoom(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String sessionId = headerAccessor.getSessionId();

        State state = roomBaseService.joinRoom(getRoomState(roomId), sessionId);
        setRoomState(state);

        messagingTemplate.convertAndSendToUser(sessionId, "/queue/joined", state);
    }

    @MessageMapping("set-username")
    public void setUsername(SimpMessageHeaderAccessor headerAccessor, String username) {
        headerAccessor.getSessionAttributes().put("SESSION_USERNAME", username);
    }

    @MessageExceptionHandler()
    public void handleMessagingExceptions(SimpMessageHeaderAccessor headerAccessor, Exception ex) {
        String sessionId = headerAccessor.getSessionId();

        var error = new WebSocketError(
                400,
                ex.getMessage()
        );

        messagingTemplate.convertAndSendToUser(sessionId, "/queue/errors", error);
    }

    protected State getRoomState(String roomId) {
        String roomKey = getRoomKey(roomId);

        try {
            String roomJson = redisTemplate.opsForValue().get(roomKey);
            if(roomJson == null) {
                throw new InvalidSessionException("Room does not exist");
            }

            return (State) mapper.readValue(roomJson, GameRoomStateBase.class);
        } catch (JsonProcessingException e) {
            throw new InvalidSessionException("Could not parse room state");
        }
    }

    protected void setRoomState(State state) {
        String roomKey = getRoomKey(state.room().roomId());

        try {
            String value = mapper.writeValueAsString(state);

            redisTemplate.opsForValue().set(roomKey, value);
        } catch (JsonProcessingException e) {
            throw new InvalidSessionException("Could not parse room state");
        }
    }

    private String getRoomKey(String roomId) {
        return REDIS_NAMESPACE + ":" + REDIS_ROOM_NAMESPACE + roomId;
    }
}
