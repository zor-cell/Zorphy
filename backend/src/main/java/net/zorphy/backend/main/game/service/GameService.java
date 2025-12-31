package net.zorphy.backend.main.game.service;

import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.main.game.dto.GameFilters;
import net.zorphy.backend.main.game.dto.GameMetadata;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.game.dto.stats.GameStats;
import net.zorphy.backend.site.core.http.dto.TeamDetails;
import net.zorphy.backend.site.core.http.dto.state.GameStateBase;
import net.zorphy.backend.site.core.http.dto.result.ResultStateBase;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface GameService {
    List<GameMetadata> getGames();

    List<GameMetadata> searchGames(GameFilters gameFilters);

    List<GameStats> getStats(GameFilters gameFilters);

    GameDetails getGame(UUID id);

    GameDetails deleteGame(UUID id);

    GameDetails saveGame(GameType gameType, GameStateBase gameState, ResultStateBase resultState, MultipartFile image, List<TeamDetails> teams);
}
