package net.zorphy.backend.site.jolly.service;

import net.zorphy.backend.main.file.dto.FileStorageFile;
import net.zorphy.backend.site.core.http.service.GameSessionSaveService;
import net.zorphy.backend.site.core.http.dto.ResultState;
import net.zorphy.backend.site.jolly.dto.RoundResult;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface JollyService extends GameSessionSaveService<GameConfig, GameState, ResultState> {
    /**
     * Adds a jolly round to the {@code oldState} and returns the modified state.
     * In the round a temporary {@code imageIdentifier} is saved as the image url, so the bytes are
     * only saved on game save
     */
    GameState saveRound(GameState oldState, List<RoundResult> results, UUID imageIdentifier);

    /**
     * Updates the round at {@code roundIndex} in the {@code oldState} and returns the modified state.
     * The round image cannot be updated.
     */
    GameState updateRound(GameState oldState, List<RoundResult> results, int roundIndex);

    /**
     * Resolves the temporary image identifiers from round saving with their corresponding
     * image from {@code images}
     */
    GameState saveRoundImages(GameState oldState, Map<String, FileStorageFile> images);
}
