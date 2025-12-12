import {PlayerDetails} from "../../all/PlayerDetails";
import {CorrelationResult} from "./CorrelationResult";
import {GameStatsMetrics} from "./GameStatsMetrics";
import {ChartDataHistory} from "./ChartDataHistory";
import {GameStatsStreak} from "./GameStatsStreak";

export interface GameStats {
    player: PlayerDetails;
    gamesPlayed: number;
    winRate: number;
    currentWinStreak: GameStatsStreak;
    maxWinStreak: GameStatsStreak;
    scoreMetrics: GameStatsMetrics<number>,
    durationMetrics: GameStatsMetrics<string>,
    nemesis: PlayerDetails | null;
    victim: PlayerDetails | null;
    rival: PlayerDetails | null;
    companion: PlayerDetails | null;
    correlations: CorrelationResult[];
    chartData: ChartDataHistory[];
    gameSpecific: any;
}