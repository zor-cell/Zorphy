package net.zorphy.backend.site.scotlandyard.dto;

import net.zorphy.backend.site.scotlandyard.dto.graph.Node;

public record HeatMapEntry(
        Node node,
        int count
) {
}
