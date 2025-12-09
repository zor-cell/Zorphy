package net.zorphy.backend.site.scotlandyard.dto;

import net.zorphy.backend.site.scotlandyard.dto.graph.EdgeType;

import java.util.List;

public record HeatMapConfig(
        int startNode,
        List<EdgeType> moves,
        List<Integer> playerNodes
) {
}
