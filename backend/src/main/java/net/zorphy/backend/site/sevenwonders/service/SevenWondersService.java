package net.zorphy.backend.site.sevenwonders.service;

import net.zorphy.backend.site.core.http.service.GameSessionService;
import net.zorphy.backend.site.core.http.service.SavableService;
import net.zorphy.backend.site.sevenwonders.dto.game.GameConfig;
import net.zorphy.backend.site.sevenwonders.dto.game.GameState;
import net.zorphy.backend.site.sevenwonders.dto.result.DuelResultState;

public interface SevenWondersService extends GameSessionService<GameConfig, GameState>, SavableService<GameState, DuelResultState> {
}
