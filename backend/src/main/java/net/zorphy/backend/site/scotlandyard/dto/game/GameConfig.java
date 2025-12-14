package net.zorphy.backend.site.scotlandyard.dto.game;

import net.zorphy.backend.site.all.dto.http.TeamDetails;
import net.zorphy.backend.site.all.dto.http.GameConfigBase;
import net.zorphy.backend.site.scotlandyard.dto.MapType;

import java.util.List;

public record GameConfig(
        List<TeamDetails> teams,
        MapType mapType
) implements GameConfigBase  {
}
