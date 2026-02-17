import {GameRoom} from "./GameRoom";
import {GameRoomStateBase} from "../../core/ws/dto/GameRoomStateBase";

export interface GameRoomState extends GameRoomStateBase {
  room: GameRoom;
}