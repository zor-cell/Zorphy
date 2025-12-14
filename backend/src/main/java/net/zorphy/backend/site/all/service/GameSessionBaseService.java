package net.zorphy.backend.site.all.service;

import net.zorphy.backend.site.all.dto.http.GameConfigBase;
import net.zorphy.backend.site.all.dto.http.GameStateBase;

/**
 * The base service for game session management
 */
public interface GameSessionBaseService<Config extends GameConfigBase, State extends GameStateBase> {
    State createSession(Config config);

    State updateSession(State oldState, Config config);
}
