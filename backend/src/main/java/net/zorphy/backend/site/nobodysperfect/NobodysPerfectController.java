package net.zorphy.backend.site.nobodysperfect;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.core.ws.controller.GameRoomBaseController;
import net.zorphy.backend.site.nobodysperfect.dto.*;
import net.zorphy.backend.site.nobodysperfect.service.NobodyIsPerfectService;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@MessageMapping("nobody-is-perfect")
public class NobodysPerfectController extends GameRoomBaseController<GameRoom, GameRoomState> {
    private final NobodyIsPerfectService socketService;

    public NobodysPerfectController(NobodyIsPerfectService socketService,
                                    SimpMessagingTemplate messagingTemplate,
                                    StringRedisTemplate stringRedisTemplate,
                                    RedisLockRegistry redisLockRegistry,
                                    ServerProperties serverProperties,
                                    ObjectMapper objectMapper
    ) {
        super(socketService,
                messagingTemplate,
                stringRedisTemplate,
                redisLockRegistry,
                serverProperties,
                objectMapper,
                GameRoomState.class,
                GameType.NOBODY_IS_PERFECT
        );
        this.socketService = socketService;
    }

    @MessageMapping("start-round/{roomId}")
    public void startRound(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.startRound(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/" + roomId, state);
        });
    }

    @MessageMapping("add-prompt/{roomId}")
    public void addPrompt(SimpMessageHeaderAccessor headerAccessor, @Payload String message, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.addPrompt(getRoomState(roomId), username, message);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/" + roomId, sanitizeState(state));
        });
    }

    @MessageMapping("guess-round/{roomId}")
    public void startGuessRound(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.startGuessRound(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/" + roomId, sanitizeState(state));
        });
    }

    @MessageMapping("reveal-round/{roomId}")
    public void revealRound(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.revealRound(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/" + roomId, state);
        });
    }

    private GameRoomState sanitizeState(GameRoomState state) {
        if(state.rounds().isEmpty()) return state;

        var currentRound = state.rounds().getLast();

        List<Prompt> anonymousPrompts = currentRound.prompts().stream()
                .map(p -> new Prompt(p.createdAt(), p.message(), null))
                .toList();

        state.rounds().set(state.rounds().size() - 1, new Round(
                currentRound.startedAt(),
                currentRound.phase(),
                anonymousPrompts)
        );

        return state;
    }

}
