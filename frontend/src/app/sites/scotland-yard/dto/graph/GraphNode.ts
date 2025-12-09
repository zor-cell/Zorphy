import {Node} from "./Node";
import {Edge} from "./Edge";

export interface GraphNode {
    node: Node;
    edges: Edge[];
}