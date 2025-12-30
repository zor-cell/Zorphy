package net.zorphy.backend.site.core.http.controller;

import jakarta.servlet.http.HttpSession;
import net.zorphy.backend.site.core.http.dto.GameStateBase;
import org.springframework.web.bind.annotation.PostMapping;

public interface UndoableController<State extends GameStateBase> {
    @PostMapping("session/undo")
    default void resume(HttpSession session) {

    }

    State getSessionState(HttpSession session);
    void setSessionState(HttpSession session, State state);
}
