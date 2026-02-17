import {Injectable} from '@angular/core';
import {GameStompService} from "../all/services/ws/game-stomp.service";
import {GameRoomState} from "./dto/GameRoomState";

@Injectable({
  providedIn: 'root'
})
export class NobodyIsPerfectService extends GameStompService<GameRoomState> {
  protected override gameType: string = 'nobody-is-perfect';

  constructor() {
    super();
    // this.subscribeDefaults();
  }

  save() {
    this.sendMessage('save/1344');
  }
}
