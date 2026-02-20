import {RoomMember} from "../../core/ws/dto/RoomMember";
import {GameRoomBase} from "../../core/ws/dto/GameRoomBase";

export interface GameRoom extends GameRoomBase {
    createdAt: string;
    roomId: string;
    members: RoomMember[];
    host: RoomMember;
}