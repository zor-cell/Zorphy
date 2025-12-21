import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GameSessionService} from "../all/services/http/game-session.service";
import {GameConfig} from "./dto/game/GameConfig";
import {GameState} from "./dto/game/GameState";
import {HeatMapConfig} from "./dto/HeatMapConfig";
import {HeatMapEntry} from "./dto/HeatMapEntry";
import {environment} from "../../../environments/environment";
import {NotificationService} from "../../main/services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class ScotlandYardService extends GameSessionService<GameConfig, GameState> {
  protected readonly baseUri: string = environment.httpApiUrl + '/scotland-yard';

  constructor(httpClient: HttpClient, notification: NotificationService) {
    super(httpClient, notification);
  }

  getHeatMap(heatMapConfig: HeatMapConfig) {
    return this.httpClient.post<HeatMapEntry[]>(`${this.baseUri}/heatmap`, heatMapConfig);
  }
}
