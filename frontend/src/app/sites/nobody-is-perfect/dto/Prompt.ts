import {GameRoomMember} from "../../core/ws/dto/GameRoomMember";

export interface Prompt {
  message: string;
  author: GameRoomMember;
}