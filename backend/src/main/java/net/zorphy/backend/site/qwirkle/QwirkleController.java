package net.zorphy.backend.site.qwirkle;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.core.http.controller.GameSessionController;
import net.zorphy.backend.site.core.http.controller.SavableController;
import net.zorphy.backend.site.core.http.dto.ResultState;
import net.zorphy.backend.site.core.http.service.SavableService;
import net.zorphy.backend.site.qwirkle.dto.SelectionInfo;
import net.zorphy.backend.site.qwirkle.dto.game.GameConfig;
import net.zorphy.backend.site.qwirkle.dto.game.GameState;
import net.zorphy.backend.site.qwirkle.dto.move.Move;
import net.zorphy.backend.site.qwirkle.dto.move.MoveGroup;
import net.zorphy.backend.site.qwirkle.dto.tile.Tile;
import net.zorphy.backend.site.qwirkle.service.QwirkleService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/qwirkle")
public class QwirkleController extends GameSessionController<GameConfig, GameState> implements
        SavableController<GameState, ResultState>
{
    private final QwirkleService qwirkleService;

    public QwirkleController(QwirkleService qwirkleService) {
        super(qwirkleService, GameType.QWIRKLE);
        this.qwirkleService = qwirkleService;
    }

    @PostMapping("undo")
    public GameState undoRoll(HttpSession session) {
        GameState gameState = qwirkleService.undoMove(getSessionState(session));
        setSessionState(session, gameState);

        return gameState;
    }

    @GetMapping("solve")
    public List<MoveGroup> getBestMoves(HttpSession session, @RequestParam(value = "maxMoves", defaultValue = "1") int maxMoves) {
        return qwirkleService.getBestMoves(getSessionState(session), maxMoves);
    }

    @PostMapping("hand/clear")
    public GameState clearHand(HttpSession session) {
        GameState gameState = qwirkleService.clearHand(getSessionState(session));
        setSessionState(session, gameState);

        return gameState;
    }

    @PostMapping("selection")
    public SelectionInfo getSelectionInfo(HttpSession session,
                                          @Valid @RequestBody List<Tile> selected,
                                          @RequestParam(value = "fromStack", defaultValue = "false") boolean fromStack) {
        return qwirkleService.getSelectionInfo(getSessionState(session), selected, fromStack);
    }

    @PostMapping("stack/draw")
    public GameState drawTile(HttpSession session, @Valid @RequestBody Tile tile) {
        GameState gameState = qwirkleService.drawTile(getSessionState(session), tile);
        setSessionState(session, gameState);

        return gameState;
    }

    @PostMapping("move")
    public GameState makeMove(HttpSession session,
                              @RequestBody Move move,
                              @RequestParam(value = "fromStack", defaultValue = "false") boolean fromStack) {
        GameState gameState = qwirkleService.makeMove(getSessionState(session), move, fromStack);
        setSessionState(session, gameState);

        return gameState;
    }

    @PostMapping(value = "image/upload", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] uploadImage(HttpSession session, @RequestParam("file") MultipartFile file) throws IOException {
        return qwirkleService.uploadImage(file.getBytes());
    }

    @PostMapping("image/confirm")
    public void confirmImage(HttpSession session) {

    }

    @Override
    public SavableService<GameState, ResultState> getSessionService() {
        return qwirkleService;
    }
}
