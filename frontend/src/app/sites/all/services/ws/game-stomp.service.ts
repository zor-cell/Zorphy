import { Injectable } from '@angular/core';
import {RxStompService} from "./rx-stomp.service";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class GameStompService {
  protected abstract readonly gameType: string;
  protected readonly APP_PREFIX = '/app/';

  private subscriptions: Subscription[] = [];

  protected constructor(protected stompService: RxStompService) {
    this.subscribeDefaults();
  }

  public createRoom() {
    this.sendMessage('create');
  }

  public joinRoom(roomId: string) {
    this.sendMessage(`join/${roomId}`);
  }

  protected sendMessage(destination: string, body: any = '') {
    this.stompService.publish({
      destination: `${this.APP_PREFIX}${this.gameType}/${destination}`,
      body: JSON.stringify(body)
    });
  }

  protected cleanup() {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private subscribeDefaults() {
    const createdSubscription = this.stompService.watch(`/user/queue/${this.gameType}/created`).subscribe(message => {
      console.log(message);
    });
    this.subscriptions.push(createdSubscription);

    const joinedSubscription = this.stompService.watch(`/user/queue/${this.gameType}/joined`).subscribe(message => {
      console.log(message);
    });
    this.subscriptions.push(joinedSubscription);

    const errorsSubscription = this.stompService.watch(`/user/queue/${this.gameType}/errors`).subscribe(message => {
      console.log(message);
    });
    this.subscriptions.push(errorsSubscription);
  }

}
