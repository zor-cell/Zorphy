package net.zorphy.backend.site.scotlandyard.dto.game;

import net.zorphy.backend.site.core.http.dto.GameStateBase;
import net.zorphy.backend.site.scotlandyard.dto.graph.GraphNode;

import java.time.Instant;
import java.util.List;

public record GameState(
        Instant startTime,
        GameConfig gameConfig,
        List<GraphNode> map
) implements GameStateBase {
}
