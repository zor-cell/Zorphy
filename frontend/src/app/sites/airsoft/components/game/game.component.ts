import {Component, inject} from '@angular/core';
import {GameRoomComponent} from "../../../core/ws/components/game-room.component";
import {AirsoftService} from "../../airsoft.service";

@Component({
  selector: 'airsoft-game',
  imports: [
    GameRoomComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class AirsoftGameComponent {
  protected roomService = inject(AirsoftService);

}
