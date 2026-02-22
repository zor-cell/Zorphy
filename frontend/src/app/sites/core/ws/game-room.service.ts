import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {WebSocketService} from "./web-socket.service";
import {map, Observable, Subscription} from "rxjs";
import {IMessage} from "@stomp/stompjs";
import {WebSocketError} from "./dto/WebSocketError";
import {NotificationService} from "../../../main/core/services/notification.service";
import {RxStompState} from "@stomp/rx-stomp";
import {GameRoomStateBase} from "./dto/GameRoomStateBase";
import {GameRoomMember} from "./dto/GameRoomMember";
import {GameRoomPrivateStateBase} from "./dto/GameRoomPrivateStateBase";

@Injectable({
  providedIn: 'root'
})
export abstract class GameRoomService<State extends GameRoomStateBase, PrivateState extends GameRoomPrivateStateBase> {
  private stompService = inject(WebSocketService);
  protected notificationService = inject(NotificationService);

  private readonly APP_PREFIX = '/app';
  private readonly SESSION_USERNAME = 'GAME_ROOM_USERNAME';
  private readonly SESSION_ROOM_ID = 'GAME_ROOM_ROOM_ID';
  private subscriptionsInitialized: boolean = false;
  private subscriptions: Subscription[] = [];

  public username = signal<string | null>(null);
  public roomId = signal<string | null>(null);
  public gameState = signal<State | null>(null);
  public userState = signal<PrivateState | null>(null);
  public connectionStatus = signal('');

  //an intermediate username state, that holds the current username and only sets the signal after a successful operation
  private pendingUsername: string | null = null;

  protected constructor() {
    this.stompService.connectionState$.subscribe(state => {
      let status = 'UNKNOWN';
      if (state == RxStompState.CONNECTING) status = 'CONNECTING';
      else if (state == RxStompState.OPEN) status = 'CONNECTED';
      else if (state == RxStompState.CLOSING) status = 'CLOSING';
      else if (state == RxStompState.CLOSED) status = 'CLOSED';

      this.connectionStatus.set(status);
    });
  }

  /**
   * The game type used for routing to game-specific destinations
   */
  protected abstract readonly gameType: string;

  /**
   * Gets called when the service disconnects from the session.
   * Use this method to reset state signals etc
   */
  protected abstract onDisconnect(): void;

  /**
   * Gets called when the service subscribes to server channels.
   * Use this method to subscribe to additional channels used in the service
   */
  protected abstract onSubscribe(roomId: string): void;

  /**
   * Creates a new room
   */
  public createRoom(username: string) {
    this.connectAndSend(username, 'create');
  }

  /**
   * Joins an existing room given by roomId
   */
  public joinRoom(username: string, roomId: string) {
    this.connectAndSend(username, `join/${roomId}`);
  }

  /**
   * Updates the members of an existing room given by roomId
   */
  public updateMembers(members: GameRoomMember[]) {
    this.sendMessage(`update-members/${this.roomId()}`, members);
  }

  public restoreSession() {
    const savedUsername = this.getSessionState<string | null>(this.SESSION_USERNAME);
    const savedRoomId = this.getSessionState<string | null>(this.SESSION_ROOM_ID);

    if (savedUsername && savedRoomId) {
      this.joinRoom(savedUsername, savedRoomId);
    }
  }

  /**
   * Disconnects the client from the websocket connection and cleans up all states
   */
  public disconnect(clearSession: boolean) {
    this.onDisconnect();

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.stompService.disconnect();

    if(clearSession) {
      this.removeSessionState(this.SESSION_USERNAME, this.username);
      this.removeSessionState(this.SESSION_ROOM_ID, this.roomId);
    } else {
      this.username.set(null);
      this.roomId.set(null);
    }

    this.gameState.set(null);
    this.subscriptionsInitialized = false;
    this.subscriptions = [];
  }

  /**
   * Sends a message to a given destination
   */
  protected sendMessage(destination: string, body: any = '') {
    this.stompService.publish({
      destination: `${this.APP_PREFIX}/${this.gameType}/${destination}`,
      body: JSON.stringify(body)
    });
  }

  /**
   * Adds a subscription to the services subscriptions
   */
  protected addSubscription(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  /**
   * Returns an observable of the given destination.
   * Use this method to create a new subscription of a destination.
   */
  protected watchAndMap<T>(destination: string): Observable<T> {
    return this.stompService.watch(`${destination}`)
      .pipe(
        map((message: IMessage) => JSON.parse(message.body) as T)
      );
  }

  private connectAndSend(username: string, destination: string, body: any = '') {
    this.pendingUsername = username;
    this.stompService.connect(username);

    if (!this.subscriptionsInitialized) {
      this.subscribeDefaults();
      this.subscriptionsInitialized = true;
    }

    this.sendMessage(destination, body);
  }

  private subscribeDefaults() {
    const createdRoom = this.watchAndMap<State>('/user/queue/created').subscribe(state => {
      this.initStates(state);
      this.subscribeTopic(state.room.roomId);
      this.notificationService.handleSuccess(`Created room ${state.room.roomId}`);
    });
    this.addSubscription(createdRoom);

    const joinedRoom = this.watchAndMap<State>('/user/queue/joined').subscribe(state => {
      this.initStates(state);
      this.subscribeTopic(state.room.roomId);
      this.notificationService.handleSuccess(`Joined room ${state.room.roomId}`);
    });
    this.addSubscription(joinedRoom);

    const privateState = this.watchAndMap<PrivateState>('/user/queue/state').subscribe(privateState => {
      this.userState.set(privateState);
    });
    this.addSubscription(privateState);

    const errors = this.watchAndMap<WebSocketError>('/user/queue/errors').subscribe(error => {
      this.notificationService.handleError(error);

      //tear down connection
      if (error.teardown) {
        this.disconnect(true);
      }
    });
    this.addSubscription(errors);
  }

  private subscribeTopic(roomId: string) {
    const topic = this.watchAndMap<State>(`/topic/game/${roomId}`).subscribe(state => {
      this.gameState.set(state);
    });
    this.addSubscription(topic);

    this.onSubscribe(roomId);
  }

  private initStates(state: State) {
    if (this.pendingUsername) {
      this.setSessionState(this.SESSION_USERNAME, this.pendingUsername, this.username);
    }
    this.setSessionState(this.SESSION_ROOM_ID, state.room.roomId, this.roomId);

    this.gameState.set(state);
  }

  private getSessionState<T>(key: string): T | null {
    const jsonValue = sessionStorage.getItem(key);
    if(jsonValue == null) {
      return null;
    }

    return JSON.parse(jsonValue);
  }

  private setSessionState<T>(key: string, value: T, stateSignal: WritableSignal<T>) {
    stateSignal.set(value);
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  private removeSessionState<T>(key: string, stateSignal: WritableSignal<T | null>) {
    stateSignal.set(null);
    sessionStorage.removeItem(key);
  }
}
