import {GameRoom} from "./GameRoom";
import {GameRoomStateBase} from "../../core/ws/dto/GameRoomStateBase";
import {RoomMember} from "../../core/ws/dto/RoomMember";
import {Prompt} from "./Prompt";

export interface GameRoomState extends GameRoomStateBase {
  room: GameRoom;
  gameMaster: RoomMember;
  prompts: Prompt[];
}