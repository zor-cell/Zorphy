import {Component, computed, inject, input, signal} from '@angular/core';
import {NobodyIsPerfectService} from "../../nobody-is-perfect.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameRoomComponent} from "../../../core/ws/components/game-room.component";
import {RoundPhase} from "../../dto/RoundPhase";
import {NotificationService} from "../../../../main/core/services/notification.service";

@Component({
  selector: 'nobody-is-perfect-game',
  imports: [
    ReactiveFormsModule,
    GameRoomComponent,
    FormsModule
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
  });

  protected currentRound = computed(() => {
    const state = this.roomService.gameState();
    if(!state || state.rounds.length === 0) return null;

    const round = state.rounds[state.rounds.length - 1];
    if(round.phase === RoundPhase.FINISHED) {
      return null;
    }

    return round;
  });

  protected promptText = signal('');

  protected startRound() {
    this.roomService.startRound();
  }

  protected submitPrompt() {
    this.roomService.submitPrompt(this.promptText());
    this.promptText.set('');
  }

  protected showPrompts() {
    this.roomService.showPrompts();
  }

  protected revealResults() {
    this.roomService.revealResults();
  }

  protected finishRound() {
    this.roomService.finishRound();
  }

  protected readonly RoundPhase = RoundPhase;
}
