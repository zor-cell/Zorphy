import {Team} from "../../../../../main/core/dto/Team";
import {ResultStateTeamBase} from "./ResultStateTeamBase";

export interface DefaultResultTeamState extends ResultStateTeamBase {
    team: Team,
    score: number
}