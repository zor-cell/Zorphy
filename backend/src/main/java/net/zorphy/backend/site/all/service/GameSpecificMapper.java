package net.zorphy.backend.site.all.service;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.all.dto.http.GameStateBase;

public interface GameSpecificMapper {
    GameType supportedType();

    GameStateBase mapGameState(GameStateBase gameState);
}
