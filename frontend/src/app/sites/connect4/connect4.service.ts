import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MoveRequest, SolveRequest, UndoRequest} from "./dto/requests";
import {MoveResponse, SolveResponse} from "./dto/responses";
import {environment} from "../../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class Connect4Service {
    private readonly baseUri: string = environment.httpApiUrl + '/connect4';
    private httpClient = inject(HttpClient);

    move(moveRequest: MoveRequest): Observable<MoveResponse> {
        return this.httpClient.post<MoveResponse>(this.baseUri + '/move', moveRequest);
    }

    undo(undoRequest: UndoRequest): Observable<MoveResponse> {
        return this.httpClient.post<MoveResponse>(this.baseUri + '/undo', undoRequest);
    }

    solve(solveRequest: SolveRequest): Observable<SolveResponse> {
        return this.httpClient.post<SolveResponse>(this.baseUri + '/solve', solveRequest);
    }
}
