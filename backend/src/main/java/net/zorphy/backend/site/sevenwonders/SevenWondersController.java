package net.zorphy.backend.site.sevenwonders;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.core.http.controller.GameSessionController;
import net.zorphy.backend.site.core.http.controller.PausableController;
import net.zorphy.backend.site.core.http.controller.SavableController;
import net.zorphy.backend.site.core.http.dto.result.ResultState;
import net.zorphy.backend.site.core.http.service.SavableService;
import net.zorphy.backend.site.sevenwonders.dto.game.GameConfig;
import net.zorphy.backend.site.sevenwonders.dto.game.GameState;
import net.zorphy.backend.site.sevenwonders.service.SevenWondersService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/seven-wonders")
public class SevenWondersController extends GameSessionController<GameConfig, GameState> implements
        SavableController<GameState, ResultState>,
        PausableController<GameState> {
    private final SevenWondersService sevenWondersService;

    public SevenWondersController(SevenWondersService sevenWondersService) {
        super(sevenWondersService, GameType.SEVEN_WONDERS);
        this.sevenWondersService = sevenWondersService;
    }

    @Override
    public SavableService<GameState, ResultState> getSessionService() {
        return sevenWondersService;
    }
}
