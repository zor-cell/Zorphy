import {GameRoomMember} from "../../core/ws/dto/GameRoomMember";
import {GameRoomBase} from "../../core/ws/dto/GameRoomBase";

export interface GameRoom extends GameRoomBase {
    createdAt: string;
    roomId: string;
    members: GameRoomMember[];
    host: GameRoomMember;
}