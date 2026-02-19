import {Injectable} from '@angular/core';
import {GameRoomService} from "../core/ws/game-room.service";
import {GameRoomState} from "./dto/GameRoomState";

@Injectable({
  providedIn: 'root'
})
export class NobodyIsPerfectService extends GameRoomService<GameRoomState> {
  protected override gameType: string = 'nobody-is-perfect';

  constructor() {
    super();
  }

  public addPrompt(roomId: string, message: string) {
    this.sendMessage(`add-prompt/${roomId}`, message);
  }
}
