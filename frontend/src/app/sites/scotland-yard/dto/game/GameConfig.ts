import {GameConfigBase} from "../../../all/dto/GameConfigBase";
import {Team} from "../../../../main/dto/all/Team";
import {MapType} from "../MapType";

export interface GameConfig extends GameConfigBase {
    teams: Team[];
    mapType: MapType;
}