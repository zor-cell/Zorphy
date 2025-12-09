import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../../main/classes/globals";
import {GameSessionService} from "../all/game-session.service";
import {GameConfig} from "./dto/game/GameConfig";
import {GameState} from "./dto/game/GameState";
import {HeatMapConfig} from "./dto/HeatMapConfig";
import {HeatMapEntry} from "./dto/HeatMapEntry";

@Injectable({
  providedIn: 'root'
})
export class ScotlandYardService extends GameSessionService<GameConfig, GameState> {
  protected readonly baseUri: string;

  constructor(httpClient: HttpClient, globals: Globals) {
    super(httpClient, globals);
    this.baseUri = this.globals.backendUri + '/scotland-yard';
  }

  getHeatMap(heatMapConfig: HeatMapConfig) {
    return this.httpClient.post<HeatMapEntry[]>(`${this.baseUri}/heatmap`, heatMapConfig);
  }
}
