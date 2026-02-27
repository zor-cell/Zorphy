import {Component, inject} from '@angular/core';
import {GameRoomComponent} from "../../../core/ws/components/game-room.component";
import {AirsoftService} from "../../airsoft.service";
import {GeoLocationService} from "../../../../main/core/services/geo-location.service";

@Component({
  selector: 'airsoft-game',
  imports: [
    GameRoomComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class AirsoftGameComponent {
  protected geoService = inject(GeoLocationService);
  protected roomService = inject(AirsoftService);

  ngOnInit() {
    this.geoService.startTracking();
  }
}
