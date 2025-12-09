import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../../main/classes/globals";
import {Observable} from "rxjs";
import {GameState} from "./dto/game/GameState";
import {GameConfig} from "./dto/game/GameConfig";
import {GameSessionService} from "../all/game-session.service";

@Injectable({
    providedIn: 'root'
})
export class CatanService extends GameSessionService<GameConfig, GameState> {
    protected readonly baseUri: string;

    constructor(httpClient: HttpClient, globals: Globals) {
        super(httpClient, globals);
        this.baseUri = this.globals.backendUri + '/catan';
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
