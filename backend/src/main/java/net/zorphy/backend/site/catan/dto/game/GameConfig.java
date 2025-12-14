package net.zorphy.backend.site.catan.dto.game;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import net.zorphy.backend.site.all.http.dto.TeamDetails;
import net.zorphy.backend.site.all.http.dto.GameConfigBase;
import net.zorphy.backend.site.catan.dto.DiceConfig;
import net.zorphy.backend.site.catan.dto.enums.GameMode;

import java.util.List;

public record GameConfig(
        @NotEmpty
        @Valid
        List<TeamDetails> teams,

        @NotNull
        GameMode gameMode,

        @NotNull
        @Valid
        DiceConfig classicDice,

        @NotNull
        @Valid
        DiceConfig eventDice,

        @NotNull
        @Min(value = 1)
        Integer maxShipTurns,

        @NotNull
        @Min(value = 1)
        Integer initialShipTurns
) implements GameConfigBase {

}
