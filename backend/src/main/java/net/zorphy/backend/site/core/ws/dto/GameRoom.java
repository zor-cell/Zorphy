package net.zorphy.backend.site.core.ws.dto;

import java.time.Instant;
import java.util.List;

public record GameRoom(
        Instant createdAt,
        String roomId,
        List<GameRoomMember> members,
        GameRoomMember host
) implements GameRoomBase { }
