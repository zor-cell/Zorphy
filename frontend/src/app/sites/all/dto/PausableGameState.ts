import {PauseEntry} from "../../../main/core/dto/PauseEntry";

export interface PausableGameState {
  pauseEntries: PauseEntry[];
}