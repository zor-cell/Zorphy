package net.zorphy.backend.site.scotlandyard.service.util.json;

import java.util.List;

public record JsonGraph(
        List<JsonNode> nodes,
        List<JsonEdge> edges
) {
}
