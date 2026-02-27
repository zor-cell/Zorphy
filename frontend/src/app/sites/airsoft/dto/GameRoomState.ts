import {GameRoom} from "../../core/ws/dto/GameRoom";
import {GameRoomStateBase} from "../../core/ws/dto/GameRoomStateBase";

export interface GameRoomState extends GameRoomStateBase {
  room: GameRoom;
}