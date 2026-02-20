package net.zorphy.backend.site.core.ws.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.core.exception.NotFoundException;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
import net.zorphy.backend.site.core.ws.dto.GameRoomBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.core.ws.dto.RoomMember;
import net.zorphy.backend.site.core.ws.service.GameRoomBaseService;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.locks.Lock;


public abstract class GameRoomBaseController<Room extends GameRoomBase, State extends GameRoomStateBase> {
    private final String SESSION_KEY;

    private final GameRoomBaseService<Room, State> roomBaseService;
    private final StringRedisTemplate redisTemplate;
    private final RedisLockRegistry redisLockRegistry;
    private final Duration sessionTimeout;
    private final ObjectMapper mapper;
    private final Class<State> stateClass;
    protected final SimpMessagingTemplate messagingTemplate;

    public GameRoomBaseController(
           GameRoomBaseService<Room, State> roomBaseService,
           SimpMessagingTemplate messagingTemplate,
           StringRedisTemplate redisTemplate,
           RedisLockRegistry redisLockRegistry,
           ServerProperties serverProperties,
           ObjectMapper mapper,
           Class<State> stateClass,
           GameType gameType
    ) {
        this.roomBaseService = roomBaseService;
        this.messagingTemplate = messagingTemplate;
        this.redisTemplate = redisTemplate;
        this.redisLockRegistry = redisLockRegistry;
        this.sessionTimeout = serverProperties.getServlet().getSession().getTimeout();
        this.mapper = mapper;
        this.stateClass = stateClass;
        this.SESSION_KEY = "zorphy:rooms:" + gameType.toString();
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

        headerAccessor.getSessionAttributes().put("room-id", state.room().roomId());

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

    @MessageMapping("update-members/{roomId}")
    public void updateMembers(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId, @Payload List<RoomMember> members) {
        String targetUser = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            State state = roomBaseService.updateMembers(getRoomState(roomId), targetUser, members);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/" + roomId, state);
        });
    }

    /**
     * Executes an action on a given {@code roomId} with a lock, so no race conditions can occur
     */
    protected void executeWithLock(String roomId, Runnable action) {
        Lock lock = redisLockRegistry.obtain(roomId);

        boolean acquired = false;
        try {
            acquired = lock.tryLock(5, java.util.concurrent.TimeUnit.SECONDS);
            if (!acquired) {
                throw new InvalidOperationException("Could not acquire lock for room " + roomId);
            }

            action.run();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new InvalidOperationException("Interrupted while waiting for room lock");
        } finally {
            if (acquired) {
                lock.unlock();
            }
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
                throw new NotFoundException("Room does not exist");
            }

            return mapper.readValue(roomJson, stateClass);
        } catch (JsonProcessingException e) {
            throw new InvalidOperationException("Could not parse room state");
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
            throw new InvalidOperationException("Could not parse room state");
        }
    }

    /**
     * Gets the target user to which private /queue/ STOMP messages should be sent
     */
    protected String getUsername(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        if(sessionId == null || sessionId.isBlank()) {
            throw new InvalidOperationException("Session ID is required");
        }

        var user = headerAccessor.getUser();
        if(user == null || user.getName() == null || user.getName().isBlank()) {
            throw new InvalidOperationException("Username is required");
        }

        return user.getName();
    }

    private String getRoomKey(String roomId) {
        return SESSION_KEY + ":" + roomId.toLowerCase();
    }
}
