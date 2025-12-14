package net.zorphy.backend.site.all.controller;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.all.service.WebSocketBaseService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public abstract class WebSocketBaseController {
    protected final SimpMessagingTemplate messagingTemplate;
    protected final GameType gameType;
    private final WebSocketBaseService socketService;

    public WebSocketBaseController(
           WebSocketBaseService socketService,
            SimpMessagingTemplate messagingTemplate,
            GameType gameType)
    {
        this.socketService = socketService;
        this.messagingTemplate = messagingTemplate;
        this.gameType = gameType;
    }

    @MessageMapping("create")
    public void createRoom(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();

        socketService.createRoom(sessionId);
    }

    @MessageMapping("join/{roomId}")
    public void joinRoom(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        String sessionId = headerAccessor.getSessionId();

        socketService.joinRoom(roomId, sessionId);
    }

    @MessageMapping("set-username")
    public void setUsername(SimpMessageHeaderAccessor headerAccessor, String username) {
        headerAccessor.getSessionAttributes().put("SESSION_USERNAME", username);
    }

    @MessageExceptionHandler()
    public void handleMessagingExceptions(SimpMessageHeaderAccessor headerAccessor, Exception ex) {
        String sessionId = headerAccessor.getSessionId();

        socketService.handleError(sessionId, ex);
    }
}
