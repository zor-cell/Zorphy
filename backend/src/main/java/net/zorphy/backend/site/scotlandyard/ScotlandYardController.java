package net.zorphy.backend.site.scotlandyard;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.all.http.controller.GameSessionBaseController;
import net.zorphy.backend.site.scotlandyard.dto.HeatMapConfig;
import net.zorphy.backend.site.scotlandyard.dto.HeatMapEntry;
import net.zorphy.backend.site.scotlandyard.dto.game.GameConfig;
import net.zorphy.backend.site.scotlandyard.dto.game.GameState;
import net.zorphy.backend.site.scotlandyard.service.ScotlandYardService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/scotland-yard")
public class ScotlandYardController extends GameSessionBaseController<GameConfig, GameState> {
    private final ScotlandYardService scotlandYardService;

    public ScotlandYardController(ScotlandYardService scotlandYardService) {
        super(scotlandYardService, GameType.SCOTLAND_YARD);

        this.scotlandYardService = scotlandYardService;
    }

    @PostMapping("heatmap")
    public List<HeatMapEntry> simulate(HttpSession session, @RequestBody @Valid HeatMapConfig heatMapConfig) {
        return scotlandYardService.computeHeatMap(getSessionState(session), heatMapConfig);
    }
}
