package net.zorphy.backend.site.all.dto;

import java.util.List;

public record GameRoom(
        String roomId,
        List<String> members
) {
}
