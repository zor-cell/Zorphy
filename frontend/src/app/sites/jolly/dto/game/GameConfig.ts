import {GameConfigBase} from "../../../core/http/dto/GameConfigBase";
import {Team} from "../../../../main/core/dto/Team";

export interface GameConfig extends GameConfigBase {
    teams: Team[],
    roundLimit: number,
    noRoundLimit: boolean
}