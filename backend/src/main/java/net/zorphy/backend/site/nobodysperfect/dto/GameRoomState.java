package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomMember;

import java.util.List;

public record GameRoomState(
        GameRoom room,
        GameRoomMember gameMaster,
        List<Round> rounds
) implements GameRoomStateBase {

}
