package net.zorphy.backend.site.core.http.service;

import net.zorphy.backend.site.core.http.dto.GameConfigBase;
import net.zorphy.backend.site.core.http.dto.state.GameStateBase;

/**
 * The base service for game session management
 */
public interface GameSessionService<Config extends GameConfigBase, State extends GameStateBase> {
    State createSession(Config config);

    State updateSession(State oldState, Config config);
}
