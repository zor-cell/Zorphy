package net.zorphy.backend.site.airsoft;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.airsoft.dto.GameRoomState;
import net.zorphy.backend.site.airsoft.dto.GeoLocation;
import net.zorphy.backend.site.airsoft.dto.PlayerGeoLocation;
import net.zorphy.backend.site.airsoft.service.AirsoftService;
import net.zorphy.backend.site.core.ws.controller.GameRoomBaseController;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;

@Controller
@MessageMapping("airsoft")
public class AirsoftController extends GameRoomBaseController<GameRoomState> {
    private final AirsoftService socketService;

    public AirsoftController(AirsoftService socketService,
                             SimpMessagingTemplate messagingTemplate,
                             StringRedisTemplate redisTemplate,
                             RedisLockRegistry redisLockRegistry,
                             ServerProperties serverProperties,
                             ObjectMapper mapper
    ) {
        super(socketService,
                messagingTemplate,
                redisTemplate,
                redisLockRegistry,
                serverProperties,
                mapper,
                GameRoomState.class,
                GameType.AIRSOFT
        );
        this.socketService = socketService;
    }

    @Override
    @MessageMapping("join/{roomId}")
    public void joinRoom(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId) {
        super.joinRoom(headerAccessor, roomId);

        String username = getUsername(headerAccessor);
        var allLocations = getAllLocations(roomId);

        messagingTemplate.convertAndSendToUser(username, "/queue/locations", allLocations);
    }

    @MessageMapping("update-location/{roomId}")
    public void updateLocation(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId, @Payload GeoLocation location) {
        String username = getUsername(headerAccessor);

        PlayerGeoLocation playerLocation = new PlayerGeoLocation(username, location);
        setLocation(roomId, playerLocation);

        messagingTemplate.convertAndSend("/topic/game/%s/locations".formatted(roomId), playerLocation);
    }

    private List<PlayerGeoLocation> getAllLocations(String roomId) {
        String key = getLocationsKey(roomId);

        Map<Object, Object> rawHash = redisTemplate.opsForHash().entries(key);

        return rawHash.values().stream()
                .map(o -> {
                    try {
                        return mapper.readValue((String) o, PlayerGeoLocation.class);
                    } catch (JsonProcessingException ex) {
                        return null;
                    }
                })
                .toList();
    }

    private void setLocation(String roomId, PlayerGeoLocation location) {
        String key = getLocationsKey(roomId);
        try {
            String locationJson = mapper.writeValueAsString(location);
            redisTemplate.opsForHash().put(key, location.username(), locationJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize location", e);
        }
    }

    private String getLocationsKey(String roomId) {
        return getRoomKey(roomId) + ":locations";
    }
}
