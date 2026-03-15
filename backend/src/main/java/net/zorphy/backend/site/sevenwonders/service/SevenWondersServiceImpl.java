package net.zorphy.backend.site.sevenwonders.service;

import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.game.service.GameService;
import net.zorphy.backend.site.core.http.dto.result.ResultState;
import net.zorphy.backend.site.sevenwonders.dto.game.GameConfig;
import net.zorphy.backend.site.sevenwonders.dto.game.GameState;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;

@Service
public class SevenWondersServiceImpl implements SevenWondersService {
    private final GameService gameService;

    public SevenWondersServiceImpl(GameService gameService) {
        this.gameService = gameService;
    }

    @Override
    public GameState createSession(GameConfig gameConfig) {
        return new GameState(
                false,
                new ArrayList<>(),
                Instant.now(),
                gameConfig,
                new ArrayList<>()
        );
    }

    @Override
    public GameState updateSession(GameState oldState, GameConfig gameConfig) {
        return new GameState(
                oldState.isSaved(),
                oldState.pauseEntries(),
                oldState.startTime(),
                gameConfig,
                oldState.rounds()
        );
    }

    @Override
    public GameDetails saveSession(GameState gameState, ResultState resultState, MultipartFile image) {
        return gameService.saveGame(
                GameType.SEVEN_WONDERS,
                gameState,
                resultState,
                image,
                gameState.gameConfig().teams()
        );
    }
}
