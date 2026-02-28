import {Injectable, signal} from '@angular/core';
import {GameRoomService} from "../core/ws/game-room.service";
import {GameRoomState} from "./dto/GameRoomState";
import {GameRoomPrivateState} from "./dto/GameRoomPrivateState";
import {State} from "sockjs-client";
import {PlayerGeoLocation} from "./dto/PlayerGeoLocation";
import {GeoLocation} from "../../main/core/dto/GeoLocation";

@Injectable({
  providedIn: 'root',
})
export class AirsoftService extends GameRoomService<GameRoomState, GameRoomPrivateState> {
    protected override gameType: string = 'airsoft';

    public locations = signal<PlayerGeoLocation[]>([]);

    protected override onDisconnect(): void {

    }

    protected override onSubscribe(roomId: string): void {
        const initLocations = this.watchAndMap<PlayerGeoLocation[]>('/queue/locations').subscribe(locations => {
            this.locations.set(locations);
        });
        this.addSubscription(initLocations);

        const updatedLocations = this.watchAndMap<PlayerGeoLocation>(`/topic/game/${roomId}/locations`).subscribe(location => {
            this.locations.update(prev => {
                const index = prev.findIndex(p => p.username === location.username);

                if (index < 0) {
                    return [...prev, location];
                }

                const newArray = [...prev];
                newArray[index] = location;
                return newArray;
            });
        });
        this.addSubscription(updatedLocations);
    }

    public updateLocation(location: GeoLocation): void {
        this.sendMessage(`update-location/${this.roomId()}`, location);
    }
}
