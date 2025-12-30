package net.zorphy.backend.site.nobodysperfect;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.site.core.ws.controller.GameRoomBaseController;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoom;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoomState;
import net.zorphy.backend.site.nobodysperfect.service.NobodyIsPerfectService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping("nobody-is-perfect")
public class NobodysPerfectController extends GameRoomBaseController<GameRoom, GameRoomState> {
    private final NobodyIsPerfectService socketService;

    public NobodysPerfectController(NobodyIsPerfectService socketService,
                                    SimpMessagingTemplate messagingTemplate,
                                    StringRedisTemplate stringRedisTemplate,
                                    ObjectMapper objectMapper
    ) {
        super(socketService, messagingTemplate, stringRedisTemplate, objectMapper);
        this.socketService = socketService;
    }
}
