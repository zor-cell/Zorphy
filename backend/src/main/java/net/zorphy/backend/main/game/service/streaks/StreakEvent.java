package net.zorphy.backend.main.game.service.streaks;

import net.zorphy.backend.main.game.dto.GameDetails;

import java.util.UUID;

public record StreakEvent(
        boolean isInStreak,
        GameDetails game,
        UUID playerId
) {}