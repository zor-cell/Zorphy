package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoomBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomMember;

import java.time.Instant;
import java.util.List;

public record GameRoom(
        Instant createdAt,
        String roomId,
        List<GameRoomMember> members,
        GameRoomMember host
) implements GameRoomBase { }
