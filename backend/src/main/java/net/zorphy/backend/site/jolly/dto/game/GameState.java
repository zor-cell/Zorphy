package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.site.core.http.dto.PausableGameState;
import net.zorphy.backend.site.core.http.dto.PauseEntry;
import net.zorphy.backend.site.core.http.dto.SavableGameState;
import net.zorphy.backend.site.jolly.dto.RoundInfo;

import java.time.Instant;
import java.util.List;

public record GameState(
        boolean isSaved,
        List<PauseEntry> pauseEntries,
        Instant startTime,
        GameConfig gameConfig,
        List<RoundInfo> rounds
) implements SavableGameState, PausableGameState {

    @Override
    public GameState withSaved(boolean saved) {
        return new GameState(saved, pauseEntries, startTime, gameConfig, rounds);
    }
}
