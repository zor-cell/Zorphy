package net.zorphy.backend.site.core.http.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.site.core.http.service.GameSessionBaseService;
import net.zorphy.backend.site.core.http.dto.GameConfigBase;
import net.zorphy.backend.site.core.http.dto.GameStateBase;
import org.springframework.web.bind.annotation.*;

/**
 * The base controller for game session management, so all basic CRUD features for game sessions
 */
public abstract class GameSessionBaseController<Config extends GameConfigBase, State extends GameStateBase> {
    private final GameSessionBaseService<Config, State> sessionBaseService;
    protected final String SESSION_KEY;

    public GameSessionBaseController(GameSessionBaseService<Config, State> sessionService, GameType gameType) {
        this.sessionBaseService = sessionService;
        this.SESSION_KEY = gameType.toString() + "_sessionState";
    }

    @GetMapping("session")
    public State getSession(HttpSession session) {
        return getSessionState(session);
    }

    @PostMapping("session")
    public State createSession(HttpSession session, @Valid @RequestBody Config gameConfig) {
        if (sessionExists(session)) {
            throw new InvalidSessionException("A game state for this session already exists");
        }

        State gameState = sessionBaseService.createSession(gameConfig);
        setSessionState(session, gameState);
        onAfterCreate(session);

        return gameState;
    }

    @PutMapping("session")
    public State updateSession(HttpSession session, @Valid @RequestBody Config gameConfig) {
        State gameState = sessionBaseService.updateSession(getSessionState(session), gameConfig);
        setSessionState(session, gameState);

        return gameState;
    }

    @DeleteMapping("session")
    public void clear(HttpSession session) {
        //check for valid session
        getSessionState(session);

        onBeforeClear(session);
        session.removeAttribute(SESSION_KEY);
    }

    /**
     * Gets the game state from the current session
     * @throws InvalidSessionException if no game state exists in the session
     */
    public State getSessionState(HttpSession session) {
        State gameState = (State) session.getAttribute(SESSION_KEY);
        if (gameState == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return gameState;
    }

    /**
     * Sets the current session game state from {@code state}
     */
    public void setSessionState(HttpSession session, State state) {
        session.setAttribute(SESSION_KEY, state);
    }

    /**
     * A hook that is executed before the session is cleared
     */
    protected void onBeforeClear(HttpSession session) {};

    /**
     * A hook that is executed after the session is created
     */
    protected void onAfterCreate(HttpSession session) {};

    private boolean sessionExists(HttpSession session) {
        try {
            getSessionState(session);
            return true;
        } catch(InvalidSessionException e) {
            return false;
        }
    }
}
