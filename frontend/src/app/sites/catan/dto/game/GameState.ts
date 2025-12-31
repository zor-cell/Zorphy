import {DiceRoll} from "../DiceRoll";
import {GameConfig} from "./GameConfig";
import {DicePair} from "../DicePair";
import {GameStateBase} from "../../../all/dto/GameStateBase";
import {SavableGameState} from "../../../all/dto/SavableGameState";
import {PausableGameState} from "../../../all/dto/PausableGameState";

export interface GameState extends GameStateBase, SavableGameState, PausableGameState {
    gameConfig: GameConfig,
    currentPlayerTurn: number,
    currentShipTurn: number,
    classicCards: DicePair[],
    eventCards: string[],
    diceRolls: DiceRoll[]
}