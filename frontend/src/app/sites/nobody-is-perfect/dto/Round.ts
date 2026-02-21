import {RoundPhase} from "./RoundPhase";
import {Prompt} from "./Prompt";

export interface Round {
  startedAt: string;
  phase: RoundPhase,
  prompts: Prompt[];
}