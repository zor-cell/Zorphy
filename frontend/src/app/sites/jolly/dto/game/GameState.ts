import {GameStateBase} from "../../../core/http/dto/GameStateBase";
import {GameConfig} from "./GameConfig";
import {RoundInfo} from "../RoundInfo";
import {SavableGameState} from "../../../core/http/dto/SavableGameState";
import {PausableGameState} from "../../../core/http/dto/PausableGameState";

export interface GameState extends GameStateBase, SavableGameState, PausableGameState {
    gameConfig: GameConfig,
    rounds: RoundInfo[]
}