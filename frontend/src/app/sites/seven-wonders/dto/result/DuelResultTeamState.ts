import {Team} from "../../../../main/core/dto/Team";

export interface DuelResultTeamState {
  team: Team;
  score: number;
  blueCardScore: number;
  greenCardScore: number;
  yellowCardScore: number;
  purpleCardScore: number;
  wonderScore: number;
  scienceScore: number;
  coinScore: number;
  warScore: number;
  wonWithWar: boolean;
  wonWithScience: boolean;
}