import {Injectable} from '@angular/core';
import {GameConfig} from "./dto/game/GameConfig";
import {GameSessionService} from "../core/http/game-session.service";
import {GameState} from "./dto/game/GameState";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../../main/core/services/notification.service";

@Injectable({
  providedIn: 'root',
})
export class SevenWondersService extends GameSessionService<GameConfig, GameState> {
  protected override baseUri: string = environment.httpApiUrl + '/jolly';

  constructor(httpClient: HttpClient, notification: NotificationService) {
    super(httpClient, notification);
  }
}
