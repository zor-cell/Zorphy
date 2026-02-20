import {RoomMember} from "./RoomMember";

export interface GameRoomBase {
  createdAt: string;
  roomId: string;
  members: RoomMember[];
  host: RoomMember;
}