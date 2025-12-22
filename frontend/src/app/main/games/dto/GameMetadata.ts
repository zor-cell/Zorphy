import {GameType} from "./GameType";
import {PlayerDetails} from "../../core/dto/PlayerDetails";

export interface GameMetadata {
    id: string,
    playedAt: Date,
    gameType: GameType,
    imageUrl?: string,
    duration: string,
    players: PlayerDetails[]
}