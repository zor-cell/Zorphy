import {Position} from "../../../../main/core/dto/Position";
import {Tile} from "./Tile";

export interface BoardTile {
    position: Position,
    tile: Tile
}