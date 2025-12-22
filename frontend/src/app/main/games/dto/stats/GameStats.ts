import {PlayerDetails} from "../../../core/dto/PlayerDetails";
import {CorrelationResult} from "./correlations/CorrelationResult";
import {GameStatsMetrics} from "./metrics/GameStatsMetrics";
import {ChartDataHistory} from "./charts/ChartDataHistory";
import {GameStatsStreakResult} from "./streaks/GameStatsStreakResult";

export interface GameStats {
    player: PlayerDetails;
    gamesPlayed: number;
    winRate: number;
    winStreaks: GameStatsStreakResult;
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