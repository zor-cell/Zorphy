import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {GameDetails} from "./dto/GameDetails";
import {Observable, tap} from "rxjs";
import {GameMetadata} from "./dto/GameMetadata";
import {GameFilters} from "./dto/GameFilters";
import {GameStats} from "./dto/stats/GameStats";
import {environment} from "../../../environments/environment";
import {NotificationService} from "../core/services/notification.service";
import {Page} from "../core/dto/Page";
import {Pageable} from "../core/dto/Pageable";

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

  searchGames(gameFilters: GameFilters | null, pageable: Pageable): Observable<Page<GameMetadata>> {
    let params = new HttpParams();

    if (gameFilters) {
      params = this.filtersToParams(gameFilters);
    }

    params = this.appendPageableToParams(params, pageable);

    return this.httpClient.get<Page<GameMetadata>>(this.baseUri + '/search', {params});
  }

  getStats(gameFilters: GameFilters | null): Observable<GameStats[]> {
    let params = new HttpParams();
    if (gameFilters) {
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

  private appendPageableToParams(params: HttpParams, pageable: Pageable): HttpParams {
    params = params
      .set('page', pageable.page)
      .set('size', pageable.size);

    if(pageable.sort) {
      params = params.set('sort', pageable.sort);
    }

    return params;
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
