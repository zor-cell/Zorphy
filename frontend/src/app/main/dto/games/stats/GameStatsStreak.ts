import {GameDetails} from "../GameDetails";

export interface GameStatsStreak {
    streak: number;
    start: GameDetails;
    end: GameDetails;
}