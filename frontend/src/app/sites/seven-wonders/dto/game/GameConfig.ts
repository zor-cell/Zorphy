import {Team} from "../../../../main/core/dto/Team";
import {GameConfigBase} from "../../../core/http/dto/GameConfigBase";
import {GameMode} from "../enums/GameMode";

export interface GameConfig extends GameConfigBase {
  teams: Team[];
  gameMode: GameMode;
}