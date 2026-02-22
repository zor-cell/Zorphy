package net.zorphy.backend.site.core.ws.dto;

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

    /**
     * Returns the state that should be visible publicly.
     * It may exclude sensitive information in certain game phases etc
     */
    GameRoomStateBase toPublicState();

    /**
     * Returns the state that should be visible privately to the given {@code username}.
     */
    GameRoomPrivateStateBase toPrivateState(String username);
}
