import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GameState} from "./dto/game/GameState";
import {Move} from "./dto/move/Move";
import {Tile} from "./dto/tile/Tile";
import {MoveGroup} from "./dto/move/MoveGroup";
import {SelectionInfo} from "./dto/SelectionInfo";
import {GameSessionService} from "../all/services/http/game-session.service";
import {GameConfig} from "./dto/game/GameConfig";
import {environment} from "../../../environments/environment";
import {NotificationService} from "../../main/core/services/notification.service";

@Injectable({
    providedIn: 'root'
})
export class QwirkleService extends GameSessionService<GameConfig, GameState> {
    protected readonly baseUri: string = environment.httpApiUrl + '/qwirkle';

    constructor(httpClient: HttpClient, notification: NotificationService) {
        super(httpClient, notification);
    }

    clearHand(): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/hand/clear', {});
    }

    getSelectionInfo(selected: Tile[], fromStack: boolean = false): Observable<SelectionInfo> {
        return this.httpClient.post<SelectionInfo>(this.baseUri + '/selection', selected, {
            params: {
                fromStack: fromStack
            }
        });
    }

    getBestMoves(maxMoves: number = 1): Observable<MoveGroup[]> {
        return this.httpClient.get<MoveGroup[]>(this.baseUri + '/solve', {
            params: {maxMoves: maxMoves.toString()}
        });
    }

    drawTile(tile: Tile): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/stack/draw', tile);
    }

    makeMove(move: Move, fromStack: boolean = false): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/move', move, {
            params: {
                fromStack: fromStack
            }
        });
    }

    undoMove() : Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/undo', {});
    }

    uploadImage(image: File): Observable<Blob> {
        const formData = new FormData();
        formData.append('file', image);

        return this.httpClient.post<Blob>(this.baseUri + '/image/upload', formData, {
            responseType: 'blob' as 'json'
        }) as Observable<Blob>;
    }

    confirmImage(): Observable<void> {
        return this.httpClient.post<void>(this.baseUri + '/image/confirm', {});
    }
}
