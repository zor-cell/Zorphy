package net.zorphy.backend.site.all.ws.controller;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.all.ws.dto.GameRoomBase;
import net.zorphy.backend.site.all.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.all.ws.service.GameRoomBaseService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public abstract class GameRoomBaseController<Room extends GameRoomBase, State extends GameRoomStateBase> {
    private final GameRoomBaseService<Room, State> socketService;

    protected final SimpMessagingTemplate messagingTemplate;

    public GameRoomBaseController(
           GameRoomBaseService<Room, State> socketService,
            SimpMessagingTemplate messagingTemplate)
    {
        this.socketService = socketService;
        this.messagingTemplate = messagingTemplate;
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
