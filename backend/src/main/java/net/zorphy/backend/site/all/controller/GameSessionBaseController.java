package net.zorphy.backend.site.all.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.all.exception.InvalidSessionException;
import net.zorphy.backend.site.all.service.GameSessionBaseService;
import net.zorphy.backend.site.all.dto.GameConfigBase;
import net.zorphy.backend.site.all.dto.GameStateBase;
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

    protected void onBeforeClear(HttpSession session) {};
    protected void onAfterCreate(HttpSession session) {};

    /**
     * Gets the game state from the current session
     * @throws InvalidSessionException if no game state exists in the session
     */
    protected State getSessionState(HttpSession session) {
        State gameState = (State) session.getAttribute(SESSION_KEY);
        if (gameState == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return gameState;
    }

    protected void setSessionState(HttpSession session, State state) {
        session.setAttribute(SESSION_KEY, state);
    }

    private boolean sessionExists(HttpSession session) {
        try {
            getSessionState(session);
            return true;
        } catch(InvalidSessionException e) {
            return false;
        }
    }
}
