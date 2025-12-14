package net.zorphy.backend.site.all.dto.ws;

import java.time.Instant;
import java.util.List;

public interface GameRoomBase {
    Instant creationTime();
    String roomId();
    List<RoomMember> members();
}
