import {GameRoomMember} from "./GameRoomMember";
import {GameRoomBase} from "./GameRoomBase";

export interface GameRoom extends GameRoomBase {
    createdAt: string;
    roomId: string;
    members: GameRoomMember[];
    host: GameRoomMember;
}