package net.zorphy.backend.site.core.http.controller;

import jakarta.servlet.http.HttpSession;
import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.site.core.http.dto.PausableGameState;
import net.zorphy.backend.site.core.http.dto.PauseEntry;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.Instant;

public interface PausableController<State extends PausableGameState> {
    @PostMapping("session/pause")
    default void pause(HttpSession session) {
        State state = getSessionState(session);

        if(state.pauseEntries() == null) {
            return;
        }


        if(state.pauseEntries() != null) {
            var last = state.pauseEntries().getLast();

            if(last != null && last.pauseTime() != null) {
                if(last.resumeTime() != null) {
                    //previous pause is finished
                    state.pauseEntries().add(new PauseEntry(Instant.now(), null));
                } else {
                    //already paused
                    throw new InvalidSessionException("Session is already paused");
                }

                setSessionState(session, state);
            }
        }
    }

    @PostMapping("session/resume")
    default void resume(HttpSession session) {
        State state = getSessionState(session);

        if(state.pauseEntries() == null) {
            throw new InvalidSessionException("Session has no pause entries");
        }

        var last = state.pauseEntries().getLast();
        if(last == null || last.pauseTime() == null) {
            throw new InvalidSessionException("Session was not paused before resuming");
        }

        if(last.resumeTime() != null) {
            throw new InvalidSessionException("Session has already resumed");
        }

        //update last entry to resumed
        var entry = new PauseEntry(last.pauseTime(), Instant.now());
        state.pauseEntries().set(state.pauseEntries().size() - 1, entry);

        setSessionState(session, state);
    }

    State getSessionState(HttpSession session);
    void setSessionState(HttpSession session, State state);
}
