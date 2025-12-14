package net.zorphy.backend.site.all.http.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.time.Instant;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = net.zorphy.backend.site.catan.dto.game.GameState.class, name = "CatanGameState"),
        @JsonSubTypes.Type(value = net.zorphy.backend.site.jolly.dto.game.GameState.class, name = "JollyGameState"),
        @JsonSubTypes.Type(value = net.zorphy.backend.site.qwirkle.dto.game.GameState.class, name = "QwirkleGameState")
})
public interface GameStateBase {
    Instant startTime();
    GameConfigBase gameConfig();
}
