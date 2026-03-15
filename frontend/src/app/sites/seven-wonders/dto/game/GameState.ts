import {SavableGameState} from "../../../core/http/dto/SavableGameState";
import {PausableGameState} from "../../../core/http/dto/PausableGameState";
import {GameStateBase} from "../../../core/http/dto/GameStateBase";
import {GameConfig} from "./GameConfig";

export interface GameState extends GameStateBase, SavableGameState, PausableGameState {
  gameConfig: GameConfig;
}