package net.zorphy.backend.site.core.shared.service;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.core.http.dto.state.GameStateBase;

public interface GameSpecificMapper {
    GameType supportedType();

    GameStateBase mapGameState(GameStateBase gameState);
}
