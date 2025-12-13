package net.zorphy.backend.site.nobodysperfect;

import net.zorphy.backend.site.all.dto.GameRoom;
import net.zorphy.backend.site.all.service.WebSocketBaseService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping("nobodys-perfect")
public class NobodysPerfectController {
    private final WebSocketBaseService socketService;

    public NobodysPerfectController(WebSocketBaseService socketService) {
        this.socketService = socketService;
    }

    @MessageMapping("create")
    @SendToUser("/queue/created")
    public GameRoom createRoom(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();

        return socketService.createRoom(sessionId);
    }

    @MessageMapping("join/{roomId}")
    public GameRoom joinRoom(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String sessionId = headerAccessor.getSessionId();

        return socketService.joinRoom(roomId, sessionId);
    }

    @MessageExceptionHandler()
    @SendToUser("/queue/errors")
    public String handleMessagingExceptions(Exception ex) {
        return "ERROR: " + ex.getMessage();
    }
}
