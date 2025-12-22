import {GameType} from "./GameType";

export interface GameFilters {
    text: string | null;
    dateFrom: string | null,
    dateTo: string | null,
    minPlayers: number | null,
    maxPlayers: number | null,
    minDuration: string | null,
    maxDuration: string | null,
    gameTypes: GameType[] | null,
    players: string[] | null
}