package net.zorphy.backend.site.scotlandyard.service.util;

import java.util.*;

public class ScotlandYardUtil {
    /*public static Map<Integer, Integer> computeHeatmap(Map<Node, List<Edge>> graph, Node start, List<EdgeType> moves) {
        Map<Integer, Integer> heatmap = new HashMap<>();

        Queue<Node> queue = new LinkedList<>();
        queue.add(start);

        for(EdgeType move : moves) {
            for(int i = 0;i < queue.size();i++) {
                Node current = queue.poll();

                List<Edge> edges = graph.get(current);
                List<Integer> neighbors = edges.stream()
                        .filter(e -> e.types().contains(move) || move.equals(EdgeType.BLACK))
                        .map(Edge::to)
                        .toList();

                for(Integer neighbor : neighbors) {
                    //add to counter heatmap
                    heatmap.merge(neighbor, 1, Integer::sum);

                    queue.add(neighbor);
                }
            }
        }

        return heatmap;
    }*/
}
