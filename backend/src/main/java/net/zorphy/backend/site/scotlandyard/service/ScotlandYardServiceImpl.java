package net.zorphy.backend.site.scotlandyard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
import net.zorphy.backend.site.scotlandyard.dto.GraphNode;
import net.zorphy.backend.site.scotlandyard.dto.MapType;
import net.zorphy.backend.site.scotlandyard.dto.game.GameConfig;
import net.zorphy.backend.site.scotlandyard.dto.game.GameState;
import net.zorphy.backend.site.scotlandyard.service.util.Edge;
import net.zorphy.backend.site.scotlandyard.service.util.Node;
import net.zorphy.backend.site.scotlandyard.service.util.Position;
import net.zorphy.backend.site.scotlandyard.service.util.json.JsonEdge;
import net.zorphy.backend.site.scotlandyard.service.util.json.JsonGraph;
import net.zorphy.backend.site.scotlandyard.service.util.json.JsonNode;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScotlandYardServiceImpl implements ScotlandYardService {
    private final ObjectMapper mapper = new ObjectMapper();

    private Map<Node, List<Edge>> readMap(MapType mapType) {
        String filename = "data/scotland-yard/" + mapType.toString().toLowerCase() + ".json";

        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(filename)) {
            if (inputStream == null) {
                throw new IllegalArgumentException("Map file not found: " + filename);
            }

            JsonGraph jsonGraph = mapper.readValue(inputStream, JsonGraph.class);

            return buildGraph(jsonGraph);
        } catch (IOException e) {
            throw new InvalidOperationException("Could not load map data for type " + mapType);
        }
    }

    private Map<Node, List<Edge>> buildGraph(JsonGraph graph) {
        var map = new HashMap<Node, List<Edge>>();

        for(JsonNode jsonNode : graph.nodes()) {
            var node = new Node(
                    jsonNode.id(),
                    new Position(jsonNode.x(), jsonNode.y())
            );
            var edges = new ArrayList<Edge>();
            for(JsonEdge jsonEdge : graph.edges()) {
                int to;
                if(jsonNode.id() == jsonEdge.from()) {
                    to = jsonEdge.to();
                } else {
                    to = jsonEdge.from();
                }
                var found = graph.nodes().stream()
                        .filter(x -> x.id() == to)
                        .findFirst().orElse(null);
                if(found == null) continue;

                Node foundNode = new Node(
                        found.id(),
                        new Position(found.x(), found.y())
                );

                edges.add(new Edge(
                        foundNode,
                        jsonEdge.type()
                ));
            }

            map.put(node, edges);
        }

        return map;
    }

    @Override
    public GameState createSession(GameConfig gameConfig) {
        var map = readMap(gameConfig.mapType());

        return new GameState(
                Instant.now(),
                gameConfig,
                listFromMap(map)
        );
    }

    @Override
    public GameState updateSession(GameState oldState, GameConfig gameConfig) {
        return null;
    }

    private static List<GraphNode> listFromMap(Map<Node, List<Edge>> map) {
        return map.entrySet().stream().map(e -> new GraphNode(
                e.getKey(),
                e.getValue()
        )).toList();
    }
}
