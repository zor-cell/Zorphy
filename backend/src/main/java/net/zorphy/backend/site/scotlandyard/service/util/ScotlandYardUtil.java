package net.zorphy.backend.site.scotlandyard.service.util;

import net.zorphy.backend.site.scotlandyard.dto.Edge;
import net.zorphy.backend.site.scotlandyard.dto.EdgeType;
import net.zorphy.backend.site.scotlandyard.dto.HeatMapEntry;
import net.zorphy.backend.site.scotlandyard.dto.Node;

import java.util.*;

public class ScotlandYardUtil {
    public static List<HeatMapEntry> computeHeatmap(Map<Node, List<Edge>> graph, Node start, List<EdgeType> moves, Set<Integer> forbiddenNodes) {
        Map<Node, Integer> heatmap = new HashMap<>();

        //Set<Node> visited = new HashSet<>();
        Queue<Node> queue = new LinkedList<>();
        queue.add(start);

        for(int j = 0;j < moves.size();j++) {
            var move = moves.get(j);

            int size = queue.size();
            for (int i = 0; i < size; i++) {
                Node current = queue.poll();

                List<Edge> edges = graph.get(current);
                List<Node> neighbors = edges.stream()
                        .filter(e -> move.equals(e.type()) || move.equals(EdgeType.BLACK))
                        .map(Edge::to)
                        .toList();

                for (Node neighbor : neighbors) {
                    if(forbiddenNodes.contains(neighbor.id())) {
                        continue;
                    }

                    //add to counter heatmap if its the last stage
                    if(j == moves.size() - 1) {
                        heatmap.merge(neighbor, 1, Integer::sum);
                    }

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
