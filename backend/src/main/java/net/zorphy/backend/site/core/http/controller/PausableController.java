package net.zorphy.backend.site.core.http.controller;

import jakarta.servlet.http.HttpSession;
import net.zorphy.backend.main.core.exception.InvalidSessionException;
import net.zorphy.backend.site.core.http.dto.state.PausableGameState;
import net.zorphy.backend.site.core.http.dto.PauseEntry;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.Instant;

public interface PausableController<State extends PausableGameState> {
    @PostMapping("session/pause")
    default State pauseSession(HttpSession session) {
        State state = getSessionState(session);

        if(state.pauseEntries() == null) {
           throw new InvalidSessionException("Invalid session pauses");
        }

        PauseEntry entry = new PauseEntry(Instant.now(), null);
        if(state.pauseEntries().isEmpty()) {
            state.pauseEntries().add(entry);
        } else {
            PauseEntry last = state.pauseEntries().getLast();

            if(last.pauseTime() != null) {
                if(last.resumeTime() != null) {
                    //previous pause is finished
                    state.pauseEntries().add(entry);
                } else {
                    //already paused
                    throw new InvalidSessionException("Session is already paused");
                }
            }
        }

        setSessionState(session, state);
        return state;
    }

    @PostMapping("session/resume")
    default State resumeSession(HttpSession session) {
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
        return state;
    }

    State getSessionState(HttpSession session);
    void setSessionState(HttpSession session, State state);
}
