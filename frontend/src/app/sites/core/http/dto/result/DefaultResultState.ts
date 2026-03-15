import {DefaultResultTeamState} from "./DefaultResultTeamState";
import {ResultStateBase} from "./ResultStateBase";

export interface DefaultResultState extends ResultStateBase {
    teams: DefaultResultTeamState[]
}