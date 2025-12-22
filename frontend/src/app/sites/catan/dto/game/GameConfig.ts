import {DiceConfig} from "../DiceConfig";
import {Team} from "../../../../main/core/dto/Team";
import {GameMode} from "../enums/GameMode";
import {GameConfigBase} from "../../../all/dto/GameConfigBase";

export interface GameConfig extends GameConfigBase {
    teams: Team[],
    gameMode: GameMode,
    classicDice: DiceConfig,
    eventDice: DiceConfig,
    maxShipTurns: number,
    initialShipTurns: number
}