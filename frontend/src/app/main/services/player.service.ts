import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable, tap} from "rxjs";
import {PlayerDetails} from "../dto/all/PlayerDetails";
import {PlayerCreate} from "../dto/all/PlayerCreate";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private readonly baseUri: string = environment.httpApiUrl + '/players';

    private httpClient = inject(HttpClient);
    private globals = inject(Globals);

    getPlayers(): Observable<PlayerDetails[]> {
        return this.httpClient.get<PlayerDetails[]>(this.baseUri);
    }

    getPlayer(name: string): Observable<PlayerDetails> {
        return this.httpClient.get<PlayerDetails>(`${this.baseUri}/${name}`);
    }

    savePlayer(player: PlayerCreate): Observable<PlayerDetails> {
        return this.httpClient.post<PlayerDetails>(`${this.baseUri}/save`, player).pipe(
            tap(() => {
                this.globals.handleSuccess('Saved player data');
            }));
    }
}
