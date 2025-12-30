package net.zorphy.backend.site.qwirkle.service;

import net.zorphy.backend.site.core.http.service.GameSessionService;
import net.zorphy.backend.site.core.http.service.SavableService;
import net.zorphy.backend.site.core.http.dto.ResultState;
import net.zorphy.backend.site.qwirkle.dto.SelectionInfo;
import net.zorphy.backend.site.qwirkle.dto.game.GameConfig;
import net.zorphy.backend.site.qwirkle.dto.game.GameState;
import net.zorphy.backend.site.qwirkle.dto.move.Move;
import net.zorphy.backend.site.qwirkle.dto.move.MoveGroup;
import net.zorphy.backend.site.qwirkle.dto.tile.Tile;

import java.util.List;

public interface QwirkleService extends GameSessionService<GameConfig, GameState>, SavableService<GameState, ResultState> {
    /**
     * Retrieves the {@code N} best moves for the given {@code gameState} where {@code N} is {@code maxMoves}.
     */
    List<MoveGroup> getBestMoves(GameState gameState, int maxMoves);

    /**
     * Draws the given {@code tile} from the stack in the given {@code gameState}.
     */
    GameState drawTile(GameState gameState, Tile tile);

    /**
     * Retrieves the selection information for the given {@code tiles} in the given {@code gameState}.
     */
    SelectionInfo getSelectionInfo(GameState gameState, List<Tile> tiles, boolean fromStack);

    /**
     * Clears the hand in the given {@code gameState}.
     */
    GameState clearHand(GameState gameState);

    /**
     * Makes the given {@code move} in the given {@code gameState}.
     */
    GameState makeMove(GameState gameState, Move move, boolean fromStack);

    GameState undoMove(GameState gameState);

    byte[] uploadImage(byte[] file);
}
