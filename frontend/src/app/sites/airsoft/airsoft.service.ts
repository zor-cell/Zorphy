import { Injectable } from '@angular/core';
import {GameRoomService} from "../core/ws/game-room.service";
import {GameRoomState} from "./dto/GameRoomState";
import {GameRoomPrivateState} from "./dto/GameRoomPrivateState";

@Injectable({
  providedIn: 'root',
})
export class AirsoftService extends GameRoomService<GameRoomState, GameRoomPrivateState> {
    protected override gameType: string = 'airsoft';

    protected override onDisconnect(): void {

    }

    protected override onSubscribe(roomId: string): void {

    }
}
