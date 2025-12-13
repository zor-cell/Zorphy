package net.zorphy.backend.site.all.service;

import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationResult;
import net.zorphy.backend.main.game.dto.stats.GameSpecificStats;
import net.zorphy.backend.main.player.dto.PlayerDetails;
import net.zorphy.backend.main.game.entity.Game;

import java.util.List;

public interface GameSpecificStatsCalculator {
    GameType supportedType();

    GameSpecificStats compute(PlayerDetails currentPlayer, List<Game> games, List<CorrelationResult> correlations);
}
