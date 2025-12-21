import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {PlayerDetails} from "../dto/all/PlayerDetails";
import {PlayerCreate} from "../dto/all/PlayerCreate";
import {environment} from "../../../environments/environment";
import {NotificationService} from "./notification.service";

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private httpClient = inject(HttpClient);
    private notification = inject(NotificationService);

    private readonly baseUri: string = environment.httpApiUrl + '/players';

    getPlayers(): Observable<PlayerDetails[]> {
        return this.httpClient.get<PlayerDetails[]>(this.baseUri);
    }

    getPlayer(name: string): Observable<PlayerDetails> {
        return this.httpClient.get<PlayerDetails>(`${this.baseUri}/${name}`);
    }

    savePlayer(player: PlayerCreate): Observable<PlayerDetails> {
        return this.httpClient.post<PlayerDetails>(`${this.baseUri}/save`, player).pipe(
            tap(() => {
                this.notification.handleSuccess('Saved player data');
            }));
    }
}
