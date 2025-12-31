import {StackTile} from "../tile/StackTile";
import {BoardTile} from "../tile/BoardTile";
import {Tile} from "../tile/Tile";
import {PositionInfo} from "../PositionInfo";
import {GameConfig} from "./GameConfig";
import {GameStateBase} from "../../../all/dto/GameStateBase";
import {Move} from "../move/Move";
import {SavableGameState} from "../../../all/dto/SavableGameState";
import {PausableGameState} from "../../../all/dto/PausableGameState";

export interface GameState extends GameStateBase, SavableGameState, PausableGameState {
    gameConfig: GameConfig,
    currentPlayerTurn: number,
    moves: Move[],
    hand: Tile[],
    stack: StackTile[],
    board: BoardTile[],
    openPositions: PositionInfo[]
}