package net.zorphy.backend.site.core.http.service;

import net.zorphy.backend.site.core.http.dto.GameConfigBase;
import net.zorphy.backend.site.core.http.dto.GameStateBase;

/**
 * The base service for game session management
 */
public interface GameSessionBaseService<Config extends GameConfigBase, State extends GameStateBase> {
    State createSession(Config config);

    State updateSession(State oldState, Config config);
}
