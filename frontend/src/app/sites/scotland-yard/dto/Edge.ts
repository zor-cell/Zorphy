import {Node} from "./Node";

export interface Edge {
    to: Node;
    type: EdgeType;
}