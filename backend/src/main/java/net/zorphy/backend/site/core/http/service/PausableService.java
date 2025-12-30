package net.zorphy.backend.site.core.http.service;

import net.zorphy.backend.site.core.http.dto.PausableGameState;

public interface PausableService<State extends PausableGameState> {
    State pauseSession(State state);
    State resumeSession(State state);
}
