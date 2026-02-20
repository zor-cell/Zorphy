import {Injectable, signal} from '@angular/core';
import {RxStomp, RxStompState} from '@stomp/rx-stomp';
import {webSocketConfig} from "./web-socket-config";

@Injectable({
    providedIn: 'root',
})
export class WebSocketService extends RxStomp {
    constructor() {
        super();
    }

    public connect(username: string): void {
        //reset connection if active
        if (this.active) {
            this.disconnect();
        }

        const finalConfig = {
            ...webSocketConfig,
            connectHeaders: {
                'user-name': username,
            },
        };

        this.configure(finalConfig);
        this.activate();
    }

    public disconnect(): void {
        this.deactivate();
    }
}
