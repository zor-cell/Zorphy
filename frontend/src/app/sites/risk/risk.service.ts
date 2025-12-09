import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../../main/classes/globals";
import {SimulationConfig} from "./dto/SimulationConfig";
import {DataEntry} from "./dto/DataEntry";
import {Data} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  protected readonly baseUri: string;

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.baseUri = this.globals.backendUri + '/risk';
  }

  simulation(config: SimulationConfig) {
    return this.httpClient.post<DataEntry[]>(this.baseUri + '/simulation', config);
  }
}
