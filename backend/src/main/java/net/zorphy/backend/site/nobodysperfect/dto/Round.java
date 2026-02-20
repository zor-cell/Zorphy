package net.zorphy.backend.site.nobodysperfect.dto;

import java.time.Instant;
import java.util.List;

public record Round(
        Instant startedAt,
        RoundPhase phase,
        List<Prompt> prompts
) {

}
