package net.zorphy.backend.site.jolly;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.file.dto.FileStorageFile;
import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.site.core.http.controller.GameSessionController;
import net.zorphy.backend.site.core.http.controller.PausableController;
import net.zorphy.backend.site.core.http.controller.SavableController;
import net.zorphy.backend.site.core.http.dto.result.ResultState;
import net.zorphy.backend.site.core.http.service.SavableService;
import net.zorphy.backend.site.jolly.dto.RoundResult;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import net.zorphy.backend.site.jolly.service.JollyService;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/jolly")
public class JollyController extends GameSessionController<GameConfig, GameState> implements
        SavableController<GameState, ResultState>,
        PausableController<GameState>
{
    private final JollyService jollyService;
    private final String SESSION_IMAGES;

    public JollyController(JollyService jollyService) {
        super(jollyService, GameType.JOLLY);
        SESSION_IMAGES = GameType.JOLLY.toString() + "_sessionImages";

        this.jollyService = jollyService;
    }

    @PostMapping(value = "round", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public GameState saveRound(HttpSession session,
                               @RequestPart("results") @Valid List<RoundResult> results,
                               @RequestPart(value = "image", required = false) MultipartFile image) {
        //add round image to session storage
        UUID id;
        try {
            id = addSessionImage(session, image);
        } catch(IOException ex) {
            id = null;
        }

        GameState gameState = jollyService.saveRound(getSessionState(session), results, id);
        setSessionState(session, gameState);

        return gameState;
    }

    @PutMapping(value = "round", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public GameState updateRound(HttpSession session,
                                 @RequestPart("roundIndex") Integer roundIndex,
                                 @RequestPart("results") @Valid List<RoundResult> results) {
        GameState gameState = jollyService.updateRound(getSessionState(session), results, roundIndex);
        setSessionState(session, gameState);

        return gameState;
    }

    @Override
    @Secured("ROLE_ADMIN")
    @PostMapping(value = "session/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public GameDetails saveSession(HttpSession session,
                                   @RequestPart("resultState") @Valid ResultState resultState,
                                   @RequestPart(value = "image", required = false) MultipartFile image) {
        var gameState = getSessionState(session);
        if(gameState.isSaved()) {
            throw new InvalidSessionException("The game state for this session was already saved");
        }

        //save round images from session before saving game
        gameState = jollyService.saveRoundImages(gameState, getSessionImages(session));
        GameDetails gameDetails = jollyService.saveSession(gameState, resultState, image);

        session.removeAttribute(SESSION_IMAGES);
        var newState = gameState.withSaved(true);
        setSessionState(session, newState);

        return gameDetails;
    }

    @Override
    @DeleteMapping("session")
    public void clear(HttpSession session) {
        //check for valid session
        getSessionState(session);

        session.removeAttribute(SESSION_KEY);
        session.removeAttribute(SESSION_IMAGES);
    }

    @Override
    public SavableService<GameState, ResultState> getSessionService() {
        return jollyService;
    }


    private Map<String, FileStorageFile> getSessionImages(HttpSession session) {
        return (Map<String, FileStorageFile>) session.getAttribute(SESSION_IMAGES);
    }

    private UUID addSessionImage(HttpSession session, MultipartFile image) throws IOException {
        if(image == null) {
            return null;
        }

        //add image to temporary storage
        Map<String, FileStorageFile> images = getSessionImages(session);
        if(images == null) {
            images = new HashMap<>();
        }

        UUID id = UUID.randomUUID();
        images.put(id.toString(), new FileStorageFile(
                image.getOriginalFilename(),
                image.getBytes())
        );
        session.setAttribute(SESSION_IMAGES, images);

        return id;
    }
}
