import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../../main/classes/globals";
import {Observable} from "rxjs";
import {GameState} from "./dto/game/GameState";
import {GameConfig} from "./dto/game/GameConfig";
import {GameSessionService} from "../all/services/http/game-session.service";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CatanService extends GameSessionService<GameConfig, GameState> {
    protected readonly baseUri: string = environment.httpApiUrl + '/catan';

    constructor(httpClient: HttpClient, globals: Globals) {
        super(httpClient, globals);
    }

    rollDice(isAlchemist: boolean): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/dice-roll', {},
            {
                params: {
                    alchemist: isAlchemist
                }
            });
    }

    undoRoll(): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/undo', {});
    }
}
