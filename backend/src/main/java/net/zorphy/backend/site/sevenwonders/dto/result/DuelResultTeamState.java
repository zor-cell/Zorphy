package net.zorphy.backend.site.sevenwonders.dto.result;

import net.zorphy.backend.site.core.http.dto.TeamDetails;
import net.zorphy.backend.site.core.http.dto.result.ResultStateTeamBase;

public record DuelResultTeamState(
        TeamDetails team,
        int score,
        int blueCardScore,
        int greenCardScore,
        int yellowCardScore,
        int purpleCardScore,
        int wonderScore,
        int scienceScore,
        int coinScore,
        int warScore,
        boolean wonWithWar,
        boolean wonWithScience
) implements ResultStateTeamBase {
}
