package net.zorphy.backend.site.scotlandyard.dto.graph;


public record Edge(
        Node to,
        EdgeType type
) {
}
