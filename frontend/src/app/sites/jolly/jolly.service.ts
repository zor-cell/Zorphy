import {Injectable} from '@angular/core';
import {GameConfig} from "./dto/game/GameConfig";
import {GameState} from "./dto/game/GameState";
import {GameSessionService} from "../all/services/http/game-session.service";
import {HttpClient} from "@angular/common/http";
import {RoundResult} from "./dto/RoundResult";
import {tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {NotificationService} from "../../main/services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class JollyService extends GameSessionService<GameConfig, GameState> {
  protected readonly baseUri: string = environment.httpApiUrl + '/jolly';


  constructor(httpClient: HttpClient, notification: NotificationService) {
    super(httpClient, notification);
  }

  saveRound(results: RoundResult[], imageFile: File | null = null) {
    const formData = this.createFormData(results, imageFile);

    return this.httpClient.post<GameState>(this.baseUri + '/round', formData).pipe(
        tap(() => {
          this.notification.handleSuccess('Saved round results');
        }));
  }

  updateRound(roundIndex: number, results: RoundResult[], imageFile: File | null = null) {
    const formData = this.createFormData(results, imageFile, roundIndex);

    return this.httpClient.put<GameState>(this.baseUri + '/round', formData).pipe(
        tap(() => {
          this.notification.handleSuccess('Updated round results');
        }));
  }

  private createFormData(results: RoundResult[], imageFile: File | null = null, roundIndex: number | null = null) {
    const formData = new FormData();
    formData.append('results', new Blob([JSON.stringify(results)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }
    if(roundIndex != null) {
      formData.append('roundIndex', new Blob([JSON.stringify(roundIndex)], { type: 'application/json' }));
    }

    return formData;
  }
}
