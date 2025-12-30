package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.site.core.http.dto.GameStateBase;
import net.zorphy.backend.site.jolly.dto.RoundInfo;

import java.time.Instant;
import java.util.List;

public record GameState(
    Instant startTime,
    GameConfig gameConfig,
    List<RoundInfo> rounds
) implements GameStateBase {
}
