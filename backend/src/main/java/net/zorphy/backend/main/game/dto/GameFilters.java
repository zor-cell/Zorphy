package net.zorphy.backend.main.game.dto;


import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GameFilters(
        String text,
        Instant dateFrom,
        Instant dateTo,
        Integer minPlayers,
        Integer maxPlayers,
        Duration minDuration,
        Duration maxDuration,
        List<GameType> gameTypes,
        List<UUID> players
) {
}
