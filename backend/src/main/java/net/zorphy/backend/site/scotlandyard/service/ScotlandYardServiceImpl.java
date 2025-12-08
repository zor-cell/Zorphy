package net.zorphy.backend.site.scotlandyard.service;

import net.zorphy.backend.site.scotlandyard.dto.game.GameConfig;
import net.zorphy.backend.site.scotlandyard.dto.game.GameState;
import org.springframework.stereotype.Service;

@Service
public class ScotlandYardServiceImpl implements ScotlandYardService {
    @Override
    public GameState createSession(GameConfig gameConfig) {
        return null;
    }

    @Override
    public GameState updateSession(GameState oldState, GameConfig gameConfig) {
        return null;
    }
}
