import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../../main/classes/globals";
import {GameSessionService} from "../all/game-session.service";
import {GameConfig} from "./dto/game/GameConfig";
import {GameState} from "./dto/game/GameState";
import {HeatMapConfig} from "./dto/HeatMapConfig";
import {HeatMapEntry} from "./dto/HeatMapEntry";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ScotlandYardService extends GameSessionService<GameConfig, GameState> {
  protected readonly baseUri: string = environment.httpApiUrl + '/scotland-yard';

  constructor(httpClient: HttpClient, globals: Globals) {
    super(httpClient, globals);
  }

  getHeatMap(heatMapConfig: HeatMapConfig) {
    return this.httpClient.post<HeatMapEntry[]>(`${this.baseUri}/heatmap`, heatMapConfig);
  }
}
