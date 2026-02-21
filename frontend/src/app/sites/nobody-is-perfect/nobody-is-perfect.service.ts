import {Injectable, signal} from '@angular/core';
import {GameRoomService} from "../core/ws/game-room.service";
import {GameRoomState} from "./dto/GameRoomState";
import {State} from "sockjs-client";
import {state} from "@angular/animations";

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

  public submitPrompt(message: string) {
    this.sendMessage(`submit-prompt/${this.roomId()}`, message);
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

  protected override subscribeGameSpecifics(): void {
    const promptSubmittedSubscription = this.watchAndMap<boolean>('/user/queue/prompt-submitted').subscribe((success) => {
      this.submittedPrompt.set(true);
      this.notificationService.handleSuccess('Prompt submitted');
    });
    this.addSubscription(promptSubmittedSubscription);
  }

  protected override cleanupBeforeDisconnect(): void {
    this.submittedPrompt.set(false);
  }
}
