import {Injectable, signal} from '@angular/core';
import {GameRoomService} from "../core/ws/game-room.service";
import {GameRoomState} from "./dto/GameRoomState";
import {Prompt} from "./dto/Prompt";

@Injectable({
  providedIn: 'root'
})
export class NobodyIsPerfectService extends GameRoomService<GameRoomState> {
  protected override gameType: string = 'nobody-is-perfect';

  public submittedPrompt = signal(false);

  constructor() {
    super();
  }

  public startRound() {
    this.sendMessage(`start-round/${this.roomId()}`);
  }

  public submitPrompt(prompt: Prompt) {
    this.sendMessage(`submit-prompt/${this.roomId()}`, prompt);
  }

  public showPrompts() {
    this.sendMessage(`show-prompts/${this.roomId()}`);
  }

  public revealResults() {
    this.sendMessage(`reveal-results/${this.roomId()}`);
  }

  public finishRound() {
    this.sendMessage(`finish-round/${this.roomId()}`);
  }

  protected override onSubscribe(roomId: string): void {
    const promptSubmitted = this.watchAndMap<boolean>('/user/queue/prompt-submitted').subscribe((success) => {
      this.submittedPrompt.set(true);
      this.notificationService.handleSuccess('Prompt submitted');
    });
    this.addSubscription(promptSubmitted);

    const roundFinished = this.watchAndMap<GameRoomState>(`/topic/game/${roomId}/round-finished`).subscribe(state => {
      this.gameState.set(state);
      this.submittedPrompt.set(false);
    });
    this.addSubscription(roundFinished);
  }

  protected override onDisconnect(): void {
    this.submittedPrompt.set(false);
  }
}
