package net.zorphy.backend.site.nobodysperfect;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.all.ws.controller.WebSocketBaseController;
import net.zorphy.backend.site.all.dto.GameRoom;
import net.zorphy.backend.site.all.ws.service.WebSocketBaseService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping("nobody-is-perfect")
public class NobodysPerfectController extends WebSocketBaseController {
    private final WebSocketBaseService socketService;

    public NobodysPerfectController(WebSocketBaseService socketService, SimpMessagingTemplate messagingTemplate) {
        super(socketService, messagingTemplate, GameType.NOBODY_IS_PERFECT);
        this.socketService = socketService;
    }

    @Secured("ROLE_ADMIN")
    @MessageMapping("save/{roomId}")
    public GameRoom saveRoom(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        return null;
    }

}
