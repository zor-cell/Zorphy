import {GameStateBase} from "../../../all/dto/GameStateBase";
import {GameConfig} from "./GameConfig";
import {GraphNode} from "../GraphNode";

export interface GameState extends GameStateBase {
    gameConfig: GameConfig;
    map: GraphNode[];
}