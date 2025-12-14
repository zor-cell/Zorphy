package net.zorphy.backend.site.nobodysperfect.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.all.ws.service.GameRoomBaseService;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoom;
import net.zorphy.backend.site.nobodysperfect.dto.GameRoomState;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NobodyIsPerfectService extends GameRoomBaseService<GameRoom, GameRoomState> {
    public NobodyIsPerfectService(
            StringRedisTemplate redisTemplate,
            SimpMessagingTemplate messagingTemplate,
            ObjectMapper mapper) {
        super(redisTemplate, messagingTemplate, mapper, GameType.NOBODY_IS_PERFECT);
    }
}
