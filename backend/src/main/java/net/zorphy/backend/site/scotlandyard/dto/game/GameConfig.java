package net.zorphy.backend.site.scotlandyard.dto.game;

import net.zorphy.backend.site.all.http.dto.TeamDetails;
import net.zorphy.backend.site.all.http.dto.GameConfigBase;
import net.zorphy.backend.site.scotlandyard.dto.MapType;

import java.util.List;

public record GameConfig(
        List<TeamDetails> teams,
        MapType mapType
) implements GameConfigBase  {
}
