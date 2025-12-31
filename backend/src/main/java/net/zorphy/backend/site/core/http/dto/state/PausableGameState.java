package net.zorphy.backend.site.core.http.dto.state;

import net.zorphy.backend.site.core.http.dto.PauseEntry;

import java.util.List;

public interface PausableGameState extends GameStateBase {
    List<PauseEntry> pauseEntries();
}
