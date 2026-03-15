package net.zorphy.backend.site.core.http.dto.result;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import net.zorphy.backend.site.sevenwonders.dto.result.DuelResultState;

import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
        defaultImpl = DefaultResultState.class
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = DefaultResultState.class, name = "DefaultResultState"),
        @JsonSubTypes.Type(value = DuelResultState.class, name = "SevenWondersResultState")
})
public interface ResultStateBase {
    @NotEmpty
    @Valid
    List<? extends ResultStateTeamBase> teams();
}
