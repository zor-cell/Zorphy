package net.zorphy.backend.main.game.dto;

public record GameDetails(
        GameMetadata metadata,
        Object gameState,
        Object result
) {
}
