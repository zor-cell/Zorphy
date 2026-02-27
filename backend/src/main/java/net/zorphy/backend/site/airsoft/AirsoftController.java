package net.zorphy.backend.site.airsoft;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.airsoft.dto.GameRoomState;
import net.zorphy.backend.site.airsoft.service.AirsoftService;
import net.zorphy.backend.site.core.ws.controller.GameRoomBaseController;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping("airsoft")
public class AirsoftController extends GameRoomBaseController<GameRoomState> {
    private final AirsoftService socketService;

    public AirsoftController(AirsoftService socketService,
                             SimpMessagingTemplate messagingTemplate,
                             StringRedisTemplate redisTemplate,
                             RedisLockRegistry redisLockRegistry,
                             ServerProperties serverProperties,
                             ObjectMapper mapper
    ) {
        super(socketService,
                messagingTemplate,
                redisTemplate,
                redisLockRegistry,
                serverProperties,
                mapper,
                GameRoomState.class,
                GameType.AIRSOFT
        );
        this.socketService = socketService;
    }
}
