import {Component, computed, inject, input} from '@angular/core';
import {NobodyIsPerfectService} from "../../nobody-is-perfect.service";
import {ReactiveFormsModule} from "@angular/forms";
import {GameRoomComponent} from "../../../core/ws/components/game-room.component";
import {state} from "@angular/animations";

@Component({
  selector: 'nobody-is-perfect-game',
  imports: [
    ReactiveFormsModule,
    GameRoomComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class NobodyIsPerfectGameComponent {
  protected roomService = inject(NobodyIsPerfectService);

  public roomId = input<string>('');

  protected isGameMaster = computed(() => {
    const state = this.roomService.gameState();
    const username = this.roomService.username();
    if(!state || !username) return false;

    return state.gameMaster.username === username;
  })
  protected readonly state = state;
}
