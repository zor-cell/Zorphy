import {GameStateBase} from "../../../core/http/dto/GameStateBase";
import {GameConfig} from "./GameConfig";
import {GraphNode} from "../graph/GraphNode";

export interface GameState extends GameStateBase {
    gameConfig: GameConfig;
    map: GraphNode[];
}