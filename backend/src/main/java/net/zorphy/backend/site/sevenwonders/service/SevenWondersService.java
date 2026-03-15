package net.zorphy.backend.site.sevenwonders.service;

import net.zorphy.backend.site.core.http.dto.result.ResultState;
import net.zorphy.backend.site.core.http.service.GameSessionService;
import net.zorphy.backend.site.core.http.service.SavableService;
import net.zorphy.backend.site.sevenwonders.dto.game.GameConfig;
import net.zorphy.backend.site.sevenwonders.dto.game.GameState;

public interface SevenWondersService extends GameSessionService<GameConfig, GameState>, SavableService<GameState, ResultState> {
}
