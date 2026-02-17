package net.zorphy.backend.site.core.ws.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.site.core.ws.dto.GameRoomBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.core.ws.service.GameRoomBaseService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;


public abstract class GameRoomBaseController<Room extends GameRoomBase, State extends GameRoomStateBase> {
    private static final String REDIS_NAMESPACE = "zorphy";
    private static final String REDIS_ROOM_NAMESPACE = "rooms:";
    private static final String SESSION_USERNAME_KEY = "SESSION_USERNAME";

    private final GameRoomBaseService<Room, State> roomBaseService;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper mapper;
    private final Class<State> stateClass;
    protected final SimpMessagingTemplate messagingTemplate;

    public GameRoomBaseController(
           GameRoomBaseService<Room, State> roomBaseService,
           SimpMessagingTemplate messagingTemplate,
           StringRedisTemplate redisTemplate,
           ObjectMapper mapper,
           Class<State> stateClass
    ) {
        this.roomBaseService = roomBaseService;
        this.messagingTemplate = messagingTemplate;
        this.redisTemplate = redisTemplate;
        this.mapper = mapper;
        this.stateClass = stateClass;
    }

    @MessageMapping("create")
    public void createRoom(SimpMessageHeaderAccessor headerAccessor) {
        String targetUser = getTargetUser(headerAccessor);

        State state = roomBaseService.createRoom(targetUser);
        setRoomState(state);

        messagingTemplate.convertAndSendToUser(targetUser,
                "/queue/created",
                state
        );
    }

    @MessageMapping("join/{roomId}")
    public void joinRoom(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String targetUser = getTargetUser(headerAccessor);

        State state = roomBaseService.joinRoom(getRoomState(roomId), targetUser);
        setRoomState(state);

        messagingTemplate.convertAndSendToUser(targetUser, "/queue/joined", state);
    }

    protected String getTargetUser(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        if(sessionId == null || sessionId.isBlank()) {
            throw new InvalidSessionException("Session ID is required");
        }

        var user = headerAccessor.getUser();
        if(user == null || user.getName() == null || user.getName().isBlank()) {
            throw new InvalidSessionException("Username is required");
        }

        return user.getName();
    }

    protected State getRoomState(String roomId) {
        String roomKey = getRoomKey(roomId);

        try {
            String roomJson = redisTemplate.opsForValue().get(roomKey);
            if(roomJson == null) {
                throw new InvalidSessionException("Room does not exist");
            }

            return mapper.readValue(roomJson, stateClass);
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
