package net.zorphy.backend.site.jolly.service;

import net.zorphy.backend.main.file.dto.FileStorageFile;
import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.file.service.FileStorageService;
import net.zorphy.backend.main.game.service.GameService;
import net.zorphy.backend.site.all.http.dto.ResultState;
import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
import net.zorphy.backend.site.jolly.dto.RoundInfo;
import net.zorphy.backend.site.jolly.dto.RoundResult;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class JollyServiceImpl implements JollyService {
    private final GameService gameService;
    private final FileStorageService fileStorageService;

    public JollyServiceImpl(GameService gameService, FileStorageService fileStorageService) {
        this.gameService = gameService;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public GameState createSession(GameConfig gameConfig) {
        return new GameState(
                Instant.now(),
                gameConfig,
                new ArrayList<>()
        );
    }

    @Override
    public GameState updateSession(GameState oldState, GameConfig gameConfig) {
        return new GameState(
                oldState.startTime(),
                gameConfig,
                oldState.rounds()
        );
    }

    @Override
    public GameDetails saveSession(GameState gameState, ResultState resultState, MultipartFile image) {
        return gameService.saveGame(
                GameType.JOLLY,
                gameState,
                resultState,
                image,
                gameState.gameConfig().teams()
        );
    }

    @Override
    public GameState saveRound(GameState oldState, List<RoundResult> results, UUID imageIdentifier) {
        List<RoundInfo> rounds = new ArrayList<>(oldState.rounds());

        if(!oldState.gameConfig().noRoundLimit() && rounds.size() >= oldState.gameConfig().roundLimit()) {
            throw new InvalidOperationException("Maximum number of rounds reached");
        }

        RoundInfo roundInfo = new RoundInfo(
                Instant.now(),
                imageIdentifier != null ? imageIdentifier.toString() : null,
                results
        );
        rounds.add(roundInfo);

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                rounds
        );
    }

    @Override
    public GameState updateRound(GameState oldState, List<RoundResult> results, int roundIndex) {
        List<RoundInfo> rounds = new ArrayList<>(oldState.rounds());

        if(roundIndex < 0 || roundIndex >= rounds.size()) {
            throw new InvalidOperationException("Invalid round index");
        }

        RoundInfo oldRound = rounds.get(roundIndex);
        rounds.set(roundIndex, new RoundInfo(
                oldRound.endTime(),
                oldRound.imageUrl(),
                results
        ));

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                rounds
        );
    }

    @Override
    public GameState saveRoundImages(GameState oldState, Map<String, FileStorageFile> images) {
        List<RoundInfo> rounds = new ArrayList<>();

        for(RoundInfo round : oldState.rounds()) {
            //save round images to file storage
            String imageUrl = null;
            if (round.imageUrl() != null) {
                FileStorageFile image = images.get(round.imageUrl());
                imageUrl = fileStorageService.saveFile(GameType.JOLLY, image);
            }

            rounds.add(new RoundInfo(
               round.endTime(),
               imageUrl,
               round.results()
            ));
        }

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                rounds
        );
    }
}
