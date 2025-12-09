package net.zorphy.backend.site.scotlandyard.service.util.json;

import net.zorphy.backend.site.scotlandyard.dto.graph.EdgeType;

public record JsonEdge(
        int from,
        int to,
        EdgeType type
) {
}
