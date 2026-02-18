import {RoomMember} from "../../core/ws/dto/RoomMember";

export interface Prompt {
  message: string;
  author: RoomMember;
}