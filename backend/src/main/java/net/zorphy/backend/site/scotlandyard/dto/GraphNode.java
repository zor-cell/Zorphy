package net.zorphy.backend.site.scotlandyard.dto;

import net.zorphy.backend.site.scotlandyard.service.util.Edge;
import net.zorphy.backend.site.scotlandyard.service.util.Node;

import java.util.List;

public record GraphNode(
        Node node,
        List<Edge> edges
) {
}
