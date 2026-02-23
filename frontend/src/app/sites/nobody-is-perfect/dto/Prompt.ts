import {GameRoomMember} from "../../core/ws/dto/GameRoomMember";

export interface Prompt {
  createdAt: string;
  message: string;
  author: GameRoomMember;
  isTruth: boolean;
}