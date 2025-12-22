import {Team} from "../../../../main/core/dto/Team";
import {GameConfigBase} from "../../../all/dto/GameConfigBase";

export interface GameConfig extends GameConfigBase {
    teams: Team[],
    playingTeam: number
}