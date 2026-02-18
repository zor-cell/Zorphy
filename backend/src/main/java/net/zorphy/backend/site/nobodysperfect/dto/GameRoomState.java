package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.core.ws.dto.RoomMember;

import java.util.List;

public record GameRoomState(
        GameRoom room,
        RoomMember host,
        RoomMember gameMaster,
        List<Prompt> prompts
) implements GameRoomStateBase {
}
