import {RxStompConfig} from "@stomp/rx-stomp";
import SockJS from "sockjs-client";

export const rxStompConfig: RxStompConfig = {
    webSocketFactory: () => {
        const WEBSOCKET_ENDPOINT = 'http://localhost:8080/api/ws';
        return new SockJS(WEBSOCKET_ENDPOINT) as WebSocket;
    },
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 5000,
    debug: (msg: string): void => {
        // console.log(new Date(), msg);
    },
};