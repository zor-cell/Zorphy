import {Team} from "../../../main/core/dto/Team";

export interface RoundResult {
    team: Team,
    score: number,
    hasClosed: boolean,
    outInOne: boolean
}