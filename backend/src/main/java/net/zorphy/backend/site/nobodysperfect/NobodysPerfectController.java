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

import java.util.ArrayList;
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

            messagingTemplate.convertAndSend("/topic/game/%s".formatted(roomId), state);
        });
    }

    @MessageMapping("submit-prompt/{roomId}")
    public void submitPrompt(SimpMessageHeaderAccessor headerAccessor, @Payload Prompt prompt, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.submitPrompt(getRoomState(roomId), username, prompt.message());
            setRoomState(state);

            messagingTemplate.convertAndSendToUser(username, "/queue/prompt-submitted", true);
            messagingTemplate.convertAndSend("/topic/game/%s".formatted(roomId), sanitizeState(state));
        });
    }

    @MessageMapping("show-prompts/{roomId}")
    public void showPrompts(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.showPrompts(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/%s".formatted(roomId), sanitizeState(state));
        });
    }

    @MessageMapping("reveal-results/{roomId}")
    public void revealRoundResults(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.revealRoundResults(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/%s".formatted(roomId), state);
        });
    }

    @MessageMapping("finish-round/{roomId}")
    public void finishRound(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.finishRound(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/%s/round-finished".formatted(roomId), state);
        });
    }

    private GameRoomState sanitizeState(GameRoomState state) {
        if(state.rounds().isEmpty()) return state;

        var currentRound = state.rounds().getLast();

        List<Prompt> anonymousPrompts = new ArrayList<>(currentRound.prompts().stream()
                .map(p -> new Prompt(p.createdAt(), p.message(), null))
                .toList());

        List<Round> safeRounds = new ArrayList<>(state.rounds());
        safeRounds.set(safeRounds.size() - 1, new Round(
                currentRound.startedAt(),
                currentRound.phase(),
                anonymousPrompts)
        );

        return new GameRoomState(
                state.room(),
                state.gameMaster(),
                safeRounds
        );
    }

}
