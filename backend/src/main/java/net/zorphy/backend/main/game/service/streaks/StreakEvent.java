package net.zorphy.backend.main.game.service.streaks;


import java.time.Instant;

public record StreakEvent(
        boolean isInStreak,
        Instant time
) {}