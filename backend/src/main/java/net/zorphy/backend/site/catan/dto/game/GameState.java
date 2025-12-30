package net.zorphy.backend.site.catan.dto.game;

import net.zorphy.backend.site.catan.dto.DicePair;
import net.zorphy.backend.site.catan.dto.DiceRoll;
import net.zorphy.backend.site.core.http.dto.PausableGameState;
import net.zorphy.backend.site.core.http.dto.PauseEntry;
import net.zorphy.backend.site.core.http.dto.SavableGameState;

import java.time.Instant;
import java.util.List;

public record GameState(
        boolean isSaved,
        List<PauseEntry> pauseEntries,
        Instant startTime,
        GameConfig gameConfig,
        int currentPlayerTurn,
        int currentShipTurn,
        List<DicePair> classicCards,
        List<Character> eventCards,
        List<DiceRoll> diceRolls
) implements SavableGameState, PausableGameState {
    @Override
    public GameState withSaved(boolean saved) {
        return new GameState(
                saved,
                pauseEntries,
                startTime,
                gameConfig,
                currentPlayerTurn,
                currentShipTurn,
                classicCards,
                eventCards,
                diceRolls
        );
    }
}
