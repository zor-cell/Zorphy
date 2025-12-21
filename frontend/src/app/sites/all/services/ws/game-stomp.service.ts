import {inject, Injectable, OnDestroy} from '@angular/core';
import {RxStompService} from "./rx-stomp.service";
import {map, Observable, Subscription} from "rxjs";
import {GameRoom} from "../../../nobody-is-perfect/dto/GameRoom";
import {IMessage} from "@stomp/stompjs";
import {WebSocketError} from "../../dto/WebSocketError";
import {NotificationService} from "../../../../main/services/notification.service";

@Injectable({
  providedIn: 'root'
})
export abstract class GameStompService implements OnDestroy {
  private stompService = inject(RxStompService);
  private notification = inject(NotificationService);

  protected abstract readonly gameType: string;
  protected readonly APP_PREFIX = '/app/';

  private subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.cleanup();
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

  protected subscribeDefaults() {
    const createdSubscription = this.watchAndMap<GameRoom>('created').subscribe(room => {
      this.notification.handleSuccess(`Room ${room.roomId} created`);
    });
    this.subscriptions.push(createdSubscription);

    const joinedSubscription = this.watchAndMap<GameRoom>('joined').subscribe(room => {
      this.notification.handleSuccess(`Room ${room.roomId} joined`);
    });
    this.subscriptions.push(joinedSubscription);

    const errorsSubscription = this.watchAndMap<WebSocketError>('errors').subscribe(error => {
      this.notification.handleError(error);
    });
    this.subscriptions.push(errorsSubscription);

    const temp = this.stompService.watch(`/topic/test`).subscribe(error => {
      console.log(error)
    });
    this.subscriptions.push(temp);
  }

  protected watchAndMap<T>(destination: string): Observable<T> {
    return this.stompService.watch(`/user/queue/${destination}`)
        .pipe(
            map((message: IMessage) => JSON.parse(message.body) as T)
        );
  }

}
