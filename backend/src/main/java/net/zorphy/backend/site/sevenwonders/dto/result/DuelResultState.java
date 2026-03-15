package net.zorphy.backend.site.sevenwonders.dto.result;

import net.zorphy.backend.site.core.http.dto.result.ResultStateBase;

import java.util.List;

public record DuelResultState(
        List<DuelResultTeamState> teams
) implements ResultStateBase {
}
