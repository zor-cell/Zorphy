import {Injectable, signal} from '@angular/core';
import {RxStomp, RxStompState} from '@stomp/rx-stomp';
import {rxStompConfig} from "../../../../rx-stomp-config";

@Injectable({
    providedIn: 'root',
})
export class RxStompService extends RxStomp {
    constructor() {
        super();
    }

    public connect(username: string): void {
        if (this.active) {
            this.deactivate();
        }

        const finalConfig = {
            ...rxStompConfig,
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
