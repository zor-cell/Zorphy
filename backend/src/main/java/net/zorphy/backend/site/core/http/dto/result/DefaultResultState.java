package net.zorphy.backend.site.core.http.dto.result;

import java.util.List;

public record DefaultResultState(
        List<DefaultResultTeamState> teams
) implements ResultStateBase {
}
