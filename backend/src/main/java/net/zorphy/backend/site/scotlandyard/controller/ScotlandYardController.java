package net.zorphy.backend.site.scotlandyard.controller;

import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.site.all.controller.GameSessionBaseController;
import net.zorphy.backend.site.scotlandyard.dto.game.GameConfig;
import net.zorphy.backend.site.scotlandyard.dto.game.GameState;
import net.zorphy.backend.site.scotlandyard.service.ScotlandYardService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/scotland-yard")
public class ScotlandYardController extends GameSessionBaseController<GameConfig, GameState> {
    private final ScotlandYardService scotlandYardService;

    public ScotlandYardController(ScotlandYardService scotlandYardService) {
        super(scotlandYardService, GameType.SCOTLAND_YARD);

        this.scotlandYardService = scotlandYardService;
    }


}
