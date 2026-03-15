package net.zorphy.backend.site.core.http.dto.result;

import net.zorphy.backend.site.core.http.dto.TeamDetails;

public interface ResultStateTeamBase {
    TeamDetails team();
    int score();
}
