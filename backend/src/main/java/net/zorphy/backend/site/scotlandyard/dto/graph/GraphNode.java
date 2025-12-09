package net.zorphy.backend.site.scotlandyard.dto.graph;

import java.util.List;

public record GraphNode(
        Node node,
        List<Edge> edges
) {
}
