package net.zorphy.backend.site.catan.service;

import net.zorphy.backend.site.core.http.service.GameSessionSaveService;
import net.zorphy.backend.site.core.http.dto.ResultState;
import net.zorphy.backend.site.catan.dto.game.GameConfig;
import net.zorphy.backend.site.catan.dto.game.GameState;

public interface CatanService extends GameSessionSaveService<GameConfig, GameState, ResultState> {
    GameState rollDice(GameState oldState, boolean isAlchemist);

    GameState undoRoll(GameState oldState);
}