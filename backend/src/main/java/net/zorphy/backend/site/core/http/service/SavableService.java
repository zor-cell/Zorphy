package net.zorphy.backend.site.core.http.service;

import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.site.core.http.dto.state.GameStateBase;
import net.zorphy.backend.site.core.http.dto.result.ResultStateBase;
import org.springframework.web.multipart.MultipartFile;

/**
 * An extension of the basic session management that includes game session saving
 */
public interface SavableService<State extends GameStateBase, Result extends ResultStateBase> {
    GameDetails saveSession(State state, Result resultState, MultipartFile image);
}
