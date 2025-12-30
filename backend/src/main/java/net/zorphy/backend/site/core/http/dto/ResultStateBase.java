package net.zorphy.backend.site.core.http.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
        defaultImpl = ResultState.class
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = ResultState.class, name = "DefaultResultState")
})
public interface ResultStateBase {
    List<ResultTeamState> teams();
}
