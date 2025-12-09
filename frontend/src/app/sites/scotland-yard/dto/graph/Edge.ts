import {Node} from "./Node";
import {EdgeType} from "./EdgeType";

export interface Edge {
    to: Node;
    type: EdgeType;
}