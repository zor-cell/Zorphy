import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GameDetails} from "../dto/games/GameDetails";
import {Observable, tap} from "rxjs";
import {GameMetadata} from "../dto/games/GameMetadata";
import {GameFilters} from "../dto/games/GameFilters";
import {GameStats} from "../dto/games/stats/GameStats";
import {environment} from "../../../environments/environment";
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private httpClient = inject(HttpClient);
  private notification = inject(NotificationService);

  private readonly baseUri = environment.httpApiUrl + '/games';
  
  getGames(): Observable<GameMetadata[]> {
    return this.httpClient.get<GameMetadata[]>(this.baseUri);
  }

  searchGames(gameFilters: GameFilters | null): Observable<GameMetadata[]> {
    let params = new HttpParams();
    if(gameFilters) {
      params = this.filtersToParams(gameFilters);
    }
    return this.httpClient.get<GameMetadata[]>(this.baseUri + '/search', {params});
  }

  getStats(gameFilters: GameFilters | null): Observable<GameStats[]> {
    let params = new HttpParams();
    if(gameFilters) {
      params = this.filtersToParams(gameFilters);
    }
    return this.httpClient.get<GameStats[]>(this.baseUri + '/stats', {params});
  }

  getGame(id: string): Observable<GameDetails> {
    return this.httpClient.get<GameDetails>(this.baseUri + '/' + id);
  }

  deleteGame(id: string) {
    return this.httpClient.delete<GameDetails>(this.baseUri + '/' + id).pipe(
        tap(() => {
          this.notification.handleSuccess('Deleted game data');
        }));
  }

  private filtersToParams(gameFilters: GameFilters): HttpParams {
    let params = new HttpParams();
    for (const key in gameFilters) {
      const value = (gameFilters as any)[key];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    }
    return params;
  }
}
