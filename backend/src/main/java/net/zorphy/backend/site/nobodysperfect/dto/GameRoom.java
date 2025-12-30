package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoomBase;
import net.zorphy.backend.site.core.ws.dto.RoomMember;

import java.time.Instant;
import java.util.List;

public record GameRoom(
        Instant creationTime,
        String roomId,
        List<RoomMember> members
) implements GameRoomBase {
}
