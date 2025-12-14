package net.zorphy.backend.site.nobodysperfect;

import net.zorphy.backend.site.all.ws.controller.GameRoomBaseController;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoom;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoomState;
import net.zorphy.backend.site.nobodysperfect.service.NobodyIsPerfectService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping("nobody-is-perfect")
public class NobodysPerfectController extends GameRoomBaseController<GameRoom, GameRoomState> {
    private final NobodyIsPerfectService socketService;

    public NobodysPerfectController(NobodyIsPerfectService socketService, SimpMessagingTemplate messagingTemplate) {
        super(socketService, messagingTemplate);
        this.socketService = socketService;
    }
}
