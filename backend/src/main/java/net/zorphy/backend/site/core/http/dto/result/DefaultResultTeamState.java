package net.zorphy.backend.site.core.http.dto.result;

import jakarta.validation.Valid;
import net.zorphy.backend.site.core.http.dto.TeamDetails;

public record DefaultResultTeamState(
        @Valid
        TeamDetails team,
        int score
) implements ResultStateTeamBase {
}
