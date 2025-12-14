package net.zorphy.backend.site.all.shared.service;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.all.http.dto.GameStateBase;

public interface GameSpecificMapper {
    GameType supportedType();

    GameStateBase mapGameState(GameStateBase gameState);
}
