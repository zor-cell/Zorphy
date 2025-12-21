import {Injectable} from '@angular/core';
import {GameStompService} from "../all/services/ws/game-stomp.service";

@Injectable({
  providedIn: 'root'
})
export class NobodyIsPerfectService extends GameStompService {
  protected override gameType: string = 'nobody-is-perfect';

  constructor() {
    super();
    this.subscribeDefaults();
  }

  save() {
    this.sendMessage('save/1344');
  }
}
