import {GameStatsMetrics} from "../../../../main/dto/games/stats/GameStatsMetrics";
import {GameStatsStreak} from "../../../../main/dto/games/stats/GameStatsStreak";

export interface GameStats {
    roundsPlayed: number,
    roundWinRate: number,
    roundScoreMetrics: GameStatsMetrics<number>,
    roundDurationMetrics: GameStatsMetrics<string>,
    outInOneRate: number,
    closedRate: number,
    maxOutInOneStreak: GameStatsStreak,
    maxClosedStreak: GameStatsStreak,
}