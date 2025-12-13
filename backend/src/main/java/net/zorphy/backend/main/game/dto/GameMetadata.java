package net.zorphy.backend.main.game.dto;

import net.zorphy.backend.main.player.dto.PlayerDetails;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GameMetadata(
        UUID id,
        Instant playedAt,
        Duration duration,
        GameType gameType,
        String imageUrl,
        List<PlayerDetails> players
) {
}
