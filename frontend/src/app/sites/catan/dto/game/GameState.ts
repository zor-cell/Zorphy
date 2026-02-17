import {DiceRoll} from "../DiceRoll";
import {GameConfig} from "./GameConfig";
import {DicePair} from "../DicePair";
import {GameStateBase} from "../../../core/http/dto/GameStateBase";
import {SavableGameState} from "../../../core/http/dto/SavableGameState";
import {PausableGameState} from "../../../core/http/dto/PausableGameState";

export interface GameState extends GameStateBase, SavableGameState, PausableGameState {
    gameConfig: GameConfig,
    currentPlayerTurn: number,
    currentShipTurn: number,
    classicCards: DicePair[],
    eventCards: string[],
    diceRolls: DiceRoll[]
}