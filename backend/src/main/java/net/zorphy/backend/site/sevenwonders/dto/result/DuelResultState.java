package net.zorphy.backend.site.sevenwonders.dto.result;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import net.zorphy.backend.site.core.http.dto.result.ResultStateBase;

import java.util.List;

@JsonTypeName("SevenWondersResultState")
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
        defaultImpl = DuelResultState.class
)
public record DuelResultState(
        List<DuelResultTeamState> teams
) implements ResultStateBase {
}
