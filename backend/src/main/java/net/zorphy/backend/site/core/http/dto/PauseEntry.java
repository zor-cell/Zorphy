package net.zorphy.backend.site.core.http.dto;

import java.time.Instant;

public record PauseEntry(
        Instant pauseTime,
        Instant resumeTime
) {
}
