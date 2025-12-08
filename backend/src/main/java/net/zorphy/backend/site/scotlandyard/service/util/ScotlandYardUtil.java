package net.zorphy.backend.site.scotlandyard.service.util;

import net.zorphy.backend.site.scotlandyard.dto.Edge;
import net.zorphy.backend.site.scotlandyard.dto.EdgeType;
import net.zorphy.backend.site.scotlandyard.dto.HeatMapEntry;
import net.zorphy.backend.site.scotlandyard.dto.Node;

import java.util.*;

public class ScotlandYardUtil {
    public static List<HeatMapEntry> computeHeatmap(Map<Node, List<Edge>> graph, Node start, List<EdgeType> moves) {
        Map<Node, Integer> heatmap = new HashMap<>();

        Queue<Node> queue = new LinkedList<>();
        queue.add(start);

        for(EdgeType move : moves) {
            for(int i = 0;i < queue.size();i++) {
                Node current = queue.poll();

                List<Edge> edges = graph.get(current);
                List<Node> neighbors = edges.stream()
                        .filter(e -> move.equals(e.type()) || move.equals(EdgeType.BLACK))
                        .map(Edge::to)
                        .toList();

                for(Node neighbor : neighbors) {
                    //add to counter heatmap
                    heatmap.merge(neighbor, 1, Integer::sum);

                    queue.add(neighbor);
                }
            }
        }

        return heatmap.entrySet().stream().map(entry -> new HeatMapEntry(
                entry.getKey(),
                entry.getValue()
        )).toList();
    }
}
