import {GameConfigBase} from "../../../core/http/dto/GameConfigBase";
import {Team} from "../../../../main/core/dto/Team";
import {MapType} from "../MapType";

export interface GameConfig extends GameConfigBase {
    teams: Team[];
    mapType: MapType;
}