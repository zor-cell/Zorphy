import { Injectable } from '@angular/core';
import {Client} from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import {Subject} from "rxjs";
import {GameRoom} from "./dto/GameRoom";

@Injectable({
  providedIn: 'root'
})
export class NobodyIsPerfectService {
  private stompClient: Client;
  private readonly WEBSOCKET_ENDPOINT = 'http://localhost:8080/api/ws';
  private readonly APP_PREFIX = '/app/nobodys-perfect';

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.WEBSOCKET_ENDPOINT) as WebSocket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: (frame) => {
        console.log('STOMP Connection established.');
        this.subscribeToDestinations();
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.body);
        //(this.errors$ as Subject<string>).next('STOMP Error: ' + frame.body);
      },
      onWebSocketClose: () => {
        console.log("disconnected");
      }
    });
  }

  private subscribeToDestinations(): void {
    this.stompClient.subscribe('/user/queue/created', (message) => {
      const room: GameRoom = JSON.parse(message.body);
      //(this.roomCreated$ as Subject<GameRoom>).next(room);
    });

    this.stompClient.subscribe('/user/queue/joined', (message) => {
      const room: GameRoom = JSON.parse(message.body);
      //(this.roomJoined$ as Subject<GameRoom>).next(room);
    });

    this.stompClient.subscribe('/user/queue/errors', (message) => {
      // The body contains the error string returned by the server's exception handler
      //(this.errors$ as Subject<string>).next(message.body);
    });
  }

  public createRoom(): void {
    if (this.stompClient.connected) {
      this.stompClient.publish({
        destination: `${this.APP_PREFIX}/create`,
        body: '',
        headers: { 'content-type': 'text/plain' }
      });
    } else {
      console.warn('Cannot create room: WebSocket not connected.');
    }
  }

  public joinRoom(roomId: string): void {
    if (this.stompClient.connected) {
      this.stompClient.publish({
        destination: `${this.APP_PREFIX}/join/${roomId}`,
        body: '',
        headers: { 'content-type': 'text/plain' }
      });
    } else {
      console.warn('Cannot join room: WebSocket not connected.');
    }
  }

  // --- Utility ---
  public disconnect(): void {
    if (this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }
}
