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


@Controller
@MessageMapping("nobody-is-perfect")
public class NobodysPerfectController extends GameRoomBaseController<GameRoomState> {
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

            resetPrivateStates(state);
            messagingTemplate.convertAndSend("/topic/game/%s".formatted(roomId), state.toPublicState());
        });
    }

    @MessageMapping("submit-prompt/{roomId}")
    public void submitPrompt(SimpMessageHeaderAccessor headerAccessor, @Payload Prompt prompt, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.submitPrompt(getRoomState(roomId), username, prompt.message());
            setRoomState(state);

            messagingTemplate.convertAndSendToUser(username, "/queue/state", state.toPrivateState(username));
            messagingTemplate.convertAndSend("/topic/game/%s".formatted(roomId), state.toPublicState());
        });
    }

    @MessageMapping("show-prompts/{roomId}")
    public void showPrompts(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.showPrompts(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/%s".formatted(roomId), state.toPublicState());
        });
    }

    @MessageMapping("reveal-results/{roomId}")
    public void revealRoundResults(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.revealRoundResults(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/%s".formatted(roomId), state.toPublicState());
        });
    }

    @MessageMapping("finish-round/{roomId}")
    public void finishRound(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String username = getUsername(headerAccessor);

        executeWithLock(roomId, () -> {
            GameRoomState state = socketService.finishRound(getRoomState(roomId), username);
            setRoomState(state);

            messagingTemplate.convertAndSend("/topic/game/%s".formatted(roomId), state.toPublicState());
        });
    }

    private void resetPrivateStates(GameRoomState state) {
        // multicast the new private state to every single member
        state.room().members().forEach(member -> {
            messagingTemplate.convertAndSendToUser(
                    member.username(),
                    "/queue/state",
                    state.toPrivateState(member.username())
            );
        });
    }
}
