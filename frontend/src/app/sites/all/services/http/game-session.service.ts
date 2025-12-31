import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {finalize, Observable, tap} from "rxjs";
import {ResultState} from "../../../../main/core/dto/result/ResultState";
import {GameDetails} from "../../../../main/games/dto/GameDetails";
import {GameConfigBase} from "../../dto/GameConfigBase";
import {GameStateBase} from "../../dto/GameStateBase";
import {NotificationService} from "../../../../main/core/services/notification.service";

@Injectable({
  providedIn: 'root'
})
export abstract class GameSessionService<Config extends GameConfigBase, State extends GameStateBase> {
  protected abstract readonly baseUri: string;

  //constructor necessary for base classes
  protected constructor(protected httpClient: HttpClient, protected notification: NotificationService) {}

  getSession(): Observable<State> {
    return this.httpClient.get<State>(this.baseUri + '/session', {
      context: this.notification.silentErrorContext
    });
  }

  createSession(config: Config): Observable<State> {
    return this.httpClient.post<State>(this.baseUri + '/session', config);
  }

  updateSession(config: Config): Observable<State> {
    return this.httpClient.put<State>(this.baseUri + '/session', config).pipe(
        tap(() => {
          this.notification.handleSuccess('Updated session');
        }));
  }

  clearSession(): Observable<void> {
    return this.httpClient.delete<void>(this.baseUri + '/session').pipe(
        tap(() => {
          this.notification.handleSuccess('Cleared session');
        }));
  }
  
  saveSession(resultState: ResultState, imageFile: File | null = null): Observable<GameDetails> {
    const formData = new FormData();
    formData.append('resultState', new Blob([JSON.stringify(resultState)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    const loadingRef = this.notification.handleLoading('Saving session...');
    return this.httpClient.post<GameDetails>(this.baseUri + '/session/save', formData).pipe(
        tap(() => {
            this.notification.handleSuccess('Saved session');
        }),
        finalize(() => {
            loadingRef.dismiss();
        })
    );
  }

  pauseSession() {
      return this.httpClient.post<State>(this.baseUri + '/session/pause', {});
  }

  resumeSession() {
      return this.httpClient.post<State>(this.baseUri + '/session/resume', {});
  }
}
