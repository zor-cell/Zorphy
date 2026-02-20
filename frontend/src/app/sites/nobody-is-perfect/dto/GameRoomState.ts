import {GameRoom} from "./GameRoom";
import {GameRoomStateBase} from "../../core/ws/dto/GameRoomStateBase";
import {GameRoomMember} from "../../core/ws/dto/GameRoomMember";
import {Prompt} from "./Prompt";

export interface GameRoomState extends GameRoomStateBase {
  room: GameRoom;
  gameMaster: GameRoomMember;
  prompts: Prompt[];
}