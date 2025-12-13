import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {finalize, Observable, tap} from "rxjs";
import {Globals} from "../../../../main/classes/globals";
import {ResultState} from "../../../../main/dto/all/result/ResultState";
import {GameDetails} from "../../../../main/dto/games/GameDetails";
import {GameConfigBase} from "../../dto/GameConfigBase";
import {GameStateBase} from "../../dto/GameStateBase";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export abstract class GameSessionService<Config extends GameConfigBase, State extends GameStateBase> {
  protected abstract readonly baseUri: string;
  private toastr = inject(ToastrService);

  //constructor necessary for base classes
  protected constructor(protected httpClient: HttpClient, protected globals: Globals) {}

  getSession(): Observable<State> {
    return this.httpClient.get<State>(this.baseUri + '/session', {
      context: this.globals.silentErrorContext
    });
  }

  createSession(config: Config): Observable<State> {
    return this.httpClient.post<State>(this.baseUri + '/session', config);
  }

  updateSession(config: Config): Observable<State> {
    return this.httpClient.put<State>(this.baseUri + '/session', config).pipe(
        tap(() => {
          this.globals.handleSuccess('Updated session data');
        }));
  }

  clearSession(): Observable<void> {
    return this.httpClient.delete<void>(this.baseUri + '/session').pipe(
        tap(() => {
          this.globals.handleSuccess('Cleared session data');
        }));
  }
  
  saveSession(resultState: ResultState, imageFile: File | null = null): Observable<GameDetails> {
    const formData = new FormData();
    formData.append('resultState', new Blob([JSON.stringify(resultState)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    const loadingToast = this.toastr.info('Saving session...', '', { disableTimeOut: true });
    return this.httpClient.post<GameDetails>(this.baseUri + '/session/save', formData).pipe(
        tap(() => {
            this.toastr.remove(loadingToast.toastId);
            this.globals.handleSuccess('Saved session data');
        }),
        finalize(() => {
            this.toastr.remove(loadingToast.toastId);
        })
    );
  }

  isSessionSaved(): Observable<boolean> {
    return this.httpClient.get<boolean>(this.baseUri + '/session/save');
  }
}
