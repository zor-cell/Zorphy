import {GameStateBase} from "../../../all/dto/GameStateBase";
import {GameConfig} from "./GameConfig";
import {RoundInfo} from "../RoundInfo";
import {SavableGameState} from "../../../all/dto/SavableGameState";
import {PausableGameState} from "../../../all/dto/PausableGameState";

export interface GameState extends GameStateBase, SavableGameState, PausableGameState {
    gameConfig: GameConfig,
    rounds: RoundInfo[]
}