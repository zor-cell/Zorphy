import {EdgeType} from "./graph/EdgeType";

export interface HeatMapConfig {
    startNode: number;
    moves: EdgeType[];
    playerNodes: number[];
}