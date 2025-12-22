import {DiceRoll} from "../DiceRoll";
import {GameStatsMetrics} from "../../../../main/games/dto/stats/metrics/GameStatsMetrics";

export interface GameStats {
    gameCount: number;
    luckMetric: number;
    rollDurationMetrics: GameStatsMetrics<string>
    diceRolls: DiceRoll[]
}