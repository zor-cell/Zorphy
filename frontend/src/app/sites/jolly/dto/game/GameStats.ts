import {GameStatsMetrics} from "../../../../main/games/dto/stats/metrics/GameStatsMetrics";
import {GameStatsStreak} from "../../../../main/games/dto/stats/streaks/GameStatsStreak";

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