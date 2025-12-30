package net.zorphy.backend.site.qwirkle.dto.game;

import net.zorphy.backend.site.core.http.dto.SavableGameState;
import net.zorphy.backend.site.qwirkle.dto.PositionInfo;
import net.zorphy.backend.site.qwirkle.dto.move.Move;
import net.zorphy.backend.site.qwirkle.dto.tile.BoardTile;
import net.zorphy.backend.site.qwirkle.dto.tile.StackTile;
import net.zorphy.backend.site.qwirkle.dto.tile.Tile;

import java.time.Instant;
import java.util.List;

public record GameState(
        boolean isSaved,
        Instant startTime,
        GameConfig gameConfig,
        int currentPlayerTurn,
        List<Move> moves,
        List<Tile> hand,
        List<StackTile> stack,
        List<BoardTile> board,
        List<PositionInfo> openPositions
) implements SavableGameState {
    @Override
    public SavableGameState withSaved(boolean saved) {
        return new GameState(saved, startTime, gameConfig, currentPlayerTurn, moves, hand, stack, board, openPositions);
    }
}
