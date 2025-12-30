package net.zorphy.backend.site.core.http.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.site.core.http.dto.ResultStateBase;
import net.zorphy.backend.site.core.http.dto.SavableGameState;
import net.zorphy.backend.site.core.http.service.SavableService;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

public interface SavableController<
        State extends SavableGameState,
        Result extends ResultStateBase> {
    @Secured("ROLE_ADMIN")
    @PostMapping(value = "session/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    default GameDetails saveSession(HttpSession session,
                                   @RequestPart("resultState") @Valid Result resultState,
                                   @RequestPart(value = "image", required = false) MultipartFile image) {
        State gameState = getSessionState(session);
        if(gameState.isSaved()) {
            throw new InvalidSessionException("The game state for this session was already saved");
        }

        var service = getSessionService();
        GameDetails gameDetails = service.saveSession(gameState, resultState, image);

        //updated saved state
        var newState = (State) gameState.withSaved(true);
        setSessionState(session, newState);

        return gameDetails;
    }

    @GetMapping(value = "session/save")
    default boolean isSessionSaved(HttpSession session) {
        State gameState = getSessionState(session);
        return gameState.isSaved();
    }

    SavableService<State, Result> getSessionService();
    State getSessionState(HttpSession session);
    void setSessionState(HttpSession session, State state);
}
