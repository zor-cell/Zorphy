import {GameRoomMember} from "./GameRoomMember";

export interface GameRoomBase {
  createdAt: string;
  roomId: string;
  members: GameRoomMember[];
  host: GameRoomMember;
}