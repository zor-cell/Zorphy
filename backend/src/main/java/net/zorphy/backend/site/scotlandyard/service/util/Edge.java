package net.zorphy.backend.site.scotlandyard.service.util;

import java.util.List;

public record Edge(
        int from,
        int to,
        List<EdgeType> types
) {
}
