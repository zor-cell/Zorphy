package net.zorphy.backend.site.all.controller;

import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.site.all.dto.GameConfigBase;
import net.zorphy.backend.site.all.dto.GameStateBase;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class WebSocketBaseController<Config extends GameConfigBase, State extends GameStateBase> {
    protected final SimpMessagingTemplate messagingTemplate;
    //protected final GameRoomBaseService<Config, State> roomBaseService;
    protected final GameType gameType;

    public WebSocketBaseController(
           // GameRoomBaseService<Config, State> roomBaseService,
            SimpMessagingTemplate messagingTemplate,
            GameType gameType)
    {
        //this.roomBaseService = roomBaseService;
        this.messagingTemplate = messagingTemplate;
        this.gameType = gameType;
    }

    @MessageMapping("create")
    public void createRoom(SimpMessageHeaderAccessor headerAccessor, Config gameConfig) {

    }

    @MessageMapping("join")
    public void joinRoom(@DestinationVariable String gameId, SimpMessageHeaderAccessor headerAccessor) {

    }
}
