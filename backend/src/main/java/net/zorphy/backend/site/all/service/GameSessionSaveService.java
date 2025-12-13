package net.zorphy.backend.site.all.service;

import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.site.all.dto.GameConfigBase;
import net.zorphy.backend.site.all.dto.GameStateBase;
import net.zorphy.backend.site.all.dto.ResultStateBase;
import org.springframework.web.multipart.MultipartFile;

/**
 * An extension of the basic session management that includes game session saving
 */
public interface GameSessionSaveService<Config extends GameConfigBase, State extends GameStateBase, Result extends ResultStateBase> extends GameSessionBaseService<Config, State> {
    GameDetails saveSession(State state, Result resultState, MultipartFile image);
}
