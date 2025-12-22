import {LinkedGameStats} from "../LinkedGameStats";

export interface GameStatsMetrics<T> {
    min: LinkedGameStats<T>,
    max: LinkedGameStats<T>,
    avg: T,
    median: T
}