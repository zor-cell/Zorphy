package net.zorphy.backend.site.core.http.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.site.core.http.service.GameSessionSaveService;
import net.zorphy.backend.site.core.http.dto.GameConfigBase;
import net.zorphy.backend.site.core.http.dto.GameStateBase;
import net.zorphy.backend.site.core.http.dto.ResultStateBase;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * An extension of the base session management controller that enables saving the session data to the database
 * @param <Config>
 * @param <State>
 * @param <Result>
 */
public abstract class GameSessionSaveController<Config extends GameConfigBase, State extends GameStateBase, Result extends ResultStateBase> extends GameSessionBaseController<Config, State> {
    private final GameSessionSaveService<Config, State, Result> sessionSaveService;
    protected final String SESSION_SAVE_KEY;

    public GameSessionSaveController(GameSessionSaveService<Config, State, Result> sessionService, GameType gameType) {
        super(sessionService, gameType);

        this.sessionSaveService = sessionService;
        this.SESSION_SAVE_KEY = gameType.toString() + "_sessionSaved";
    }

    @Override
    protected void onAfterCreate(HttpSession session) {
        setSessionSaved(session, false);
    }

    @Override
    protected void onBeforeClear(HttpSession session) {
        session.removeAttribute(SESSION_SAVE_KEY);
    }

    @Secured("ROLE_ADMIN")
    @PostMapping(value = "session/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public GameDetails saveSession(HttpSession session,
                                   @RequestPart("resultState") @Valid Result resultState,
                                   @RequestPart(value = "image", required = false) MultipartFile image) {
        var gameState = getSessionState(session);
        if(getSessionSaved(session)) {
            throw new InvalidSessionException("The game state for this session was already saved");
        }

        GameDetails gameDetails = sessionSaveService.saveSession(gameState, resultState, image);
        setSessionSaved(session, true);

        return gameDetails;
    }

    @GetMapping(value = "session/save")
    public boolean isSessionSaved(HttpSession session) {
        return getSessionSaved(session);
    }

    protected boolean getSessionSaved(HttpSession session) {
        Boolean sessionSaved = (Boolean) session.getAttribute(SESSION_SAVE_KEY);
        if(sessionSaved == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return sessionSaved;
    }

    protected void setSessionSaved(HttpSession session, boolean sessionSaved) {
        session.setAttribute(SESSION_SAVE_KEY, sessionSaved);
    }
}
