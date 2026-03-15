package net.zorphy.backend.site.sevenwonders.dto.game;

import net.zorphy.backend.site.core.http.dto.GameConfigBase;
import net.zorphy.backend.site.core.http.dto.TeamDetails;
import net.zorphy.backend.site.sevenwonders.dto.enums.GameMode;

import java.util.List;

public record GameConfig(
        List<TeamDetails> teams,
        GameMode gameMode
) implements GameConfigBase {
}
