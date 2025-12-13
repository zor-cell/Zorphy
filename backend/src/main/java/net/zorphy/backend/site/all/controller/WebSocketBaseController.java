package net.zorphy.backend.site.all.controller;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.all.dto.GameConfigBase;
import net.zorphy.backend.site.all.dto.GameStateBase;
import net.zorphy.backend.site.all.service.WebSocketBaseService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;

public class WebSocketBaseController<Config extends GameConfigBase, State extends GameStateBase> {
    protected final SimpMessagingTemplate messagingTemplate;
    //protected final GameRoomBaseService<Config, State> roomBaseService;
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
    @SendToUser("/queue/created")
    public String createRoom(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        return "sessionId";
    }

    @MessageMapping("join/{roomId}")
    public void joinRoom(@DestinationVariable String gameId, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
    }
}
