import {Injectable, signal} from '@angular/core';
import {GameRoomService} from "../core/ws/game-room.service";
import {GameRoomState} from "./dto/GameRoomState";
import {Prompt} from "./dto/Prompt";
import {GameRoomPrivateState} from "./dto/GameRoomPrivateState";

@Injectable({
  providedIn: 'root'
})
export class NobodyIsPerfectService extends GameRoomService<GameRoomState, GameRoomPrivateState> {
  protected override gameType: string = 'nobody-is-perfect';

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

  }

  protected override onDisconnect(): void {

  }
}
