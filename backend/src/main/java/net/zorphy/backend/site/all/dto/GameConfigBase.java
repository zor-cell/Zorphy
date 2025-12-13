package net.zorphy.backend.site.all.dto;

import net.zorphy.backend.main.player.dto.TeamDetails;

import java.util.List;

public interface GameConfigBase {
    List<TeamDetails> teams();
}
