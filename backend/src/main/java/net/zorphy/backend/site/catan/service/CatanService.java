package net.zorphy.backend.site.catan.service;

import net.zorphy.backend.site.core.http.service.GameSessionService;
import net.zorphy.backend.site.core.http.service.SavableService;
import net.zorphy.backend.site.core.http.dto.ResultState;
import net.zorphy.backend.site.catan.dto.game.GameConfig;
import net.zorphy.backend.site.catan.dto.game.GameState;

public interface CatanService extends GameSessionService<GameConfig, GameState>, SavableService<GameState, ResultState> {
    GameState rollDice(GameState oldState, boolean isAlchemist);

    GameState undoRoll(GameState oldState);
}