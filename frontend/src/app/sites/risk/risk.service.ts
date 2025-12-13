import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../../main/classes/globals";
import {SimulationConfig} from "./dto/SimulationConfig";
import {DataEntry} from "./dto/DataEntry";
import {Data} from "@angular/router";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  protected readonly baseUri: string = environment.httpApiUrl + '/risk';

  private httpClient = inject(HttpClient);

  simulation(config: SimulationConfig) {
    return this.httpClient.post<DataEntry[]>(this.baseUri + '/simulation', config);
  }
}
