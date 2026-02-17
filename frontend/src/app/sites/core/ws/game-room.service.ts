import {inject, Injectable, OnDestroy, signal} from '@angular/core';
import {RxStompService} from "./rx-stomp.service";
import {map, Observable, Subscription} from "rxjs";
import {GameRoom} from "../../nobody-is-perfect/dto/GameRoom";
import {IMessage} from "@stomp/stompjs";
import {WebSocketError} from "./dto/WebSocketError";
import {NotificationService} from "../../../main/core/services/notification.service";
import {RxStompState} from "@stomp/rx-stomp";
import {GameRoomState} from "../../nobody-is-perfect/dto/GameRoomState";

@Injectable({
  providedIn: 'root'
})
export abstract class GameRoomService<State extends GameRoomState> {
  private stompService = inject(RxStompService);
  private notification = inject(NotificationService);

  protected abstract readonly gameType: string;
  protected readonly APP_PREFIX = '/app/';

  private subscriptionsInitialized: boolean = false;
  private subscriptions: Subscription[] = [];

  public connectionStatus = signal('');
  public gameState = signal<State | null>(null);

  protected constructor() {
    this.stompService.connectionState$.subscribe(state => {
      let status = 'UNKNOWN';
      if(state == RxStompState.CONNECTING) status = 'CONNECTING';
      else if(state == RxStompState.OPEN) status = 'CONNECTED';
      else if(state == RxStompState.CLOSING) status = 'CLOSING';
      else if(state == RxStompState.CLOSED) status = 'CLOSED';

      this.connectionStatus.set(status);
    });
  }

  public createRoom(username: string) {
    this.connectAndSend(username,'create');
  }

  public joinRoom(username: string, roomId: string) {
    this.connectAndSend(username, `join/${roomId}`);
  }

  public disconnect() {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.stompService.disconnect();
  }

  private connectAndSend(username: string, destination: string, body: any = '') {
    this.stompService.connect(username);

    if(!this.subscriptionsInitialized) {
      this.subscribeDefaults();
      this.subscriptionsInitialized = true;
    }

    this.sendMessage(destination, body);
  }

  protected sendMessage(destination: string, body: any = '') {
    this.stompService.publish({
      destination: `${this.APP_PREFIX}${this.gameType}/${destination}`,
      body: JSON.stringify(body)
    });
  }

  protected subscribeDefaults() {
    const createdSubscription = this.watchAndMap<State>('/user/queue/created').subscribe(state => {
      this.gameState.set(state);
      this.notification.handleSuccess(`Room ${state.room.roomId} created`);

      this.subscribeRoom(state.room.roomId);
    });
    this.subscriptions.push(createdSubscription);

    const joinedSubscription = this.watchAndMap<State>('/user/queue/joined').subscribe(state => {
      this.gameState.set(state);
      this.notification.handleSuccess(`Room ${state.room.roomId} joined`);

      this.subscribeRoom(state.room.roomId);
    });
    this.subscriptions.push(joinedSubscription);

    const errorsSubscription = this.watchAndMap<WebSocketError>('/user/queue/errors').subscribe(error => {
      this.notification.handleError(error);
    });
    this.subscriptions.push(errorsSubscription);
  }

  private subscribeRoom(roomId: string) {
    const topicSubscription = this.watchAndMap<State>(`/topic/game/${roomId}`).subscribe(state => {
      this.gameState.set(state);
    });
    this.subscriptions.push(topicSubscription);
  }

  protected watchAndMap<T>(destination: string): Observable<T> {
    return this.stompService.watch(`${destination}`)
        .pipe(
            map((message: IMessage) => JSON.parse(message.body) as T)
        );
  }

}
