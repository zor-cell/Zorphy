package net.zorphy.backend.site.core.http.dto;

import java.util.List;

public interface PausableGameState extends GameStateBase {
    List<PauseEntry> pauseEntries();
}
