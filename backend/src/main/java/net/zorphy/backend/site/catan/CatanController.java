package net.zorphy.backend.site.catan;

import jakarta.servlet.http.HttpSession;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.core.http.controller.GameSessionBaseController;
import net.zorphy.backend.site.core.http.controller.SavableController;
import net.zorphy.backend.site.core.http.dto.ResultState;
import net.zorphy.backend.site.catan.dto.game.GameConfig;
import net.zorphy.backend.site.catan.dto.game.GameState;
import net.zorphy.backend.site.catan.service.CatanService;
import net.zorphy.backend.site.core.http.service.GameSessionSaveService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/catan")
public class CatanController extends GameSessionBaseController<GameConfig, GameState>
        implements SavableController<GameConfig, GameState, ResultState> {
    private final CatanService catanService;

    public CatanController(CatanService catanService) {
        super(catanService, GameType.CATAN);
        this.catanService = catanService;
    }

    @PostMapping("dice-roll")
    public GameState rollDice(HttpSession session,
                                  @RequestParam(name = "alchemist", required = false, defaultValue = "false") boolean alchemist) {
        GameState gameState = catanService.rollDice(getSessionState(session), alchemist);
        setSessionState(session, gameState);

        return gameState;
    }

    @PostMapping("undo")
    public GameState undoRoll(HttpSession session) {
        GameState gameState = catanService.undoRoll(getSessionState(session));
        setSessionState(session, gameState);

        return gameState;
    }

    @Override
    public GameSessionSaveService<GameConfig, GameState, ResultState> getSessionService() {
        return catanService;
    }
}
