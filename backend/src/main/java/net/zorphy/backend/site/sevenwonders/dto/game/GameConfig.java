package net.zorphy.backend.site.sevenwonders.dto.game;

import net.zorphy.backend.site.core.http.dto.GameConfigBase;
import net.zorphy.backend.site.core.http.dto.TeamDetails;

import java.util.List;

public record GameConfig(
        List<TeamDetails> teams
) implements GameConfigBase {
}
