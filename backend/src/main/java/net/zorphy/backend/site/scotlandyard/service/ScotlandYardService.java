package net.zorphy.backend.site.scotlandyard.service;

import net.zorphy.backend.site.all.http.service.GameSessionBaseService;
import net.zorphy.backend.site.scotlandyard.dto.HeatMapConfig;
import net.zorphy.backend.site.scotlandyard.dto.HeatMapEntry;
import net.zorphy.backend.site.scotlandyard.dto.game.GameConfig;
import net.zorphy.backend.site.scotlandyard.dto.game.GameState;

import java.util.List;

public interface ScotlandYardService extends GameSessionBaseService<GameConfig, GameState> {
    List<HeatMapEntry> computeHeatMap(GameState oldState, HeatMapConfig heatMapConfig);
}
