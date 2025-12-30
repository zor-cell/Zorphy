package net.zorphy.backend.site.scotlandyard.service;

import net.zorphy.backend.site.core.http.service.GameSessionService;
import net.zorphy.backend.site.scotlandyard.dto.HeatMapConfig;
import net.zorphy.backend.site.scotlandyard.dto.HeatMapEntry;
import net.zorphy.backend.site.scotlandyard.dto.game.GameConfig;
import net.zorphy.backend.site.scotlandyard.dto.game.GameState;

import java.util.List;

public interface ScotlandYardService extends GameSessionService<GameConfig, GameState> {
    List<HeatMapEntry> computeHeatMap(GameState oldState, HeatMapConfig heatMapConfig);
}
