import {RoomMember} from "./RoomMember";

export interface GameRoom {
    createdAt: string;
    roomId: string;
    members: RoomMember[];
}