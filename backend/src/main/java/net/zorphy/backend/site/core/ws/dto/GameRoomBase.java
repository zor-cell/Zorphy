package net.zorphy.backend.site.core.ws.dto;

import java.time.Instant;
import java.util.List;

public interface GameRoomBase {
    Instant creationTime();
    String roomId();
    List<RoomMember> members();
}
