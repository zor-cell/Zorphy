import {Position} from "../../../../main/core/dto/Position";
import {Tile} from "../tile/Tile";
import {MoveGroupInfo} from "./MoveGroupInfo";

export interface MoveGroup {
    position: Position,
    tiles: Tile[]
    groupInfos: MoveGroupInfo[]
}