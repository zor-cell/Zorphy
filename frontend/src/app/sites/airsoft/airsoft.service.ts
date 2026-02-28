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
        this.locations.set([]);
    }

    protected override onSubscribe() {
        const initLocations = this.watchAndMap<PlayerGeoLocation[]>('/user/queue/locations').subscribe(locations => {
            console.log(locations)
            this.locations.set(locations);
        });
        this.addSubscription(initLocations);
    }

    protected override onSubscribeWithRoom(roomId: string): void {
        const updatedLocations = this.watchAndMap<PlayerGeoLocation>(`/topic/game/${roomId}/locations`).subscribe(location => {
            this.locations.update(prev => {
                //null keys means delete the location entry
                if(!location.location) {
                    return prev.filter(p => p.username !== location.username);
                }

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
