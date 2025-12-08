package net.zorphy.backend.site.scotlandyard.service.util.json;

import net.zorphy.backend.site.scotlandyard.service.util.EdgeType;

public record JsonEdge(
        int from,
        int to,
        EdgeType type
) {
}
