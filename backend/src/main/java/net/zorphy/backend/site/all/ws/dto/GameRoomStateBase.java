package net.zorphy.backend.site.all.ws.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = net.zorphy.backend.site.nobodysperfect.dto.GameRoomState.class, name = "NobodyIsPerfectGameRoomState"),
})
public interface GameRoomStateBase {
    GameRoomBase room();
}
