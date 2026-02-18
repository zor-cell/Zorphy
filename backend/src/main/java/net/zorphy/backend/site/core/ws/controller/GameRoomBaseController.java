package net.zorphy.backend.site.core.ws.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.site.core.ws.dto.GameRoomBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.core.ws.service.GameRoomBaseService;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;


public abstract class GameRoomBaseController<Room extends GameRoomBase, State extends GameRoomStateBase> {
    private static final String REDIS_NAMESPACE = "zorphy";
    private static final String REDIS_ROOM_NAMESPACE = "rooms";

    private final ConcurrentHashMap<String, Lock> roomLocks = new ConcurrentHashMap<>();
    private final GameRoomBaseService<Room, State> roomBaseService;
    private final StringRedisTemplate redisTemplate;
    private final Duration sessionTimeout;
    private final ObjectMapper mapper;
    private final Class<State> stateClass;
    protected final SimpMessagingTemplate messagingTemplate;

    public GameRoomBaseController(
           GameRoomBaseService<Room, State> roomBaseService,
           SimpMessagingTemplate messagingTemplate,
           StringRedisTemplate redisTemplate,
           ServerProperties serverProperties,
           ObjectMapper mapper,
           Class<State> stateClass
    ) {
        this.roomBaseService = roomBaseService;
        this.messagingTemplate = messagingTemplate;
        this.redisTemplate = redisTemplate;
        this.sessionTimeout = serverProperties.getServlet().getSession().getTimeout();
        this.mapper = mapper;
        this.stateClass = stateClass;
    }

    @EventListener
    public void leaveRoom(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        if(accessor.getUser() == null || accessor.getSessionAttributes() == null) {
            return;
        }

        String username = accessor.getUser().getName();
        String roomId = accessor.getSessionAttributes().get("room-id").toString();

        executeWithLock(roomId, () -> {
            State state = roomBaseService.leaveRoom(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/" + roomId, state);
        });
    }

    @MessageMapping("create")
    public void createRoom(SimpMessageHeaderAccessor headerAccessor) {
        String targetUser = getUsername(headerAccessor);

        State state = roomBaseService.createRoom(targetUser);
        setRoomState(state);

        messagingTemplate.convertAndSendToUser(targetUser, "/queue/created", state);
    }

    @MessageMapping("join/{roomId}")
    public void joinRoom(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String targetUser = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            State state = roomBaseService.joinRoom(getRoomState(roomId), targetUser);
            setRoomState(state);

            headerAccessor.getSessionAttributes().put("room-id", roomId);

            messagingTemplate.convertAndSendToUser(targetUser, "/queue/joined", state);
            messagingTemplate.convertAndSend("/topic/game/" + roomId, state);
        });
    }

    /**
     * Executes an action on a given {@code roomId} with a lock, so no race conditions can occur
     */
    protected void executeWithLock(String roomId, Runnable action) {
        Lock lock = roomLocks.computeIfAbsent(roomId, k -> new ReentrantLock());

        lock.lock();
        try {
            action.run();
        } finally {
            lock.unlock();
        }
    }

    /**
     * Gets the current room state from the session storage
     * Calls to this method should always be wrapped by {@link #executeWithLock} to avoid race conditions
     */
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

    /**
     * Sets the current room state in the session storage
     * Calls to this method should always be wrapped by {@link #executeWithLock} to avoid race conditions
     */
    protected void setRoomState(State state) {
        String roomKey = getRoomKey(state.room().roomId());

        try {
            String value = mapper.writeValueAsString(state);

            redisTemplate.opsForValue().set(roomKey, value);
            redisTemplate.expire(roomKey, sessionTimeout);
        } catch (JsonProcessingException e) {
            throw new InvalidSessionException("Could not parse room state");
        }
    }

    /**
     * Gets the target user to which private /queue/ STOMP messages should be sent
     */
    protected String getUsername(SimpMessageHeaderAccessor headerAccessor) {
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

    private String getRoomKey(String roomId) {
        return REDIS_NAMESPACE + ":" + REDIS_ROOM_NAMESPACE + ":" + roomId;
    }
}
