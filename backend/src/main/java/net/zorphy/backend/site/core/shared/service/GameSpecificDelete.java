package net.zorphy.backend.site.core.shared.service;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.game.entity.Game;

public interface GameSpecificDelete {
    GameType supportedType();

    void beforeDelete(Game game);
}
