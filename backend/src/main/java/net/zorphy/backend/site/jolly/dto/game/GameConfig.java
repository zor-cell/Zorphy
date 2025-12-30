package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.site.core.http.dto.TeamDetails;
import net.zorphy.backend.site.core.http.dto.GameConfigBase;

import java.util.List;

public record GameConfig(
        List<TeamDetails> teams,
        int roundLimit,
        boolean noRoundLimit
) implements GameConfigBase {
}
