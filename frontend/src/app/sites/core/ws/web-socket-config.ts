import {RxStompConfig} from "@stomp/rx-stomp";
import SockJS from "sockjs-client";
import {environment} from "../../../../environments/environment";

export const webSocketConfig: RxStompConfig = {
    webSocketFactory: () => {
        return new SockJS(environment.wsApiUrl) as WebSocket;
    },
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 0,
    debug: (msg: string): void => {
        //console.log(msg);
    },
};