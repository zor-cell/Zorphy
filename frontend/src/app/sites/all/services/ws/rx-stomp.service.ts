import {Injectable} from '@angular/core';
import {RxStomp} from '@stomp/rx-stomp';

@Injectable({
    providedIn: 'root',
})
export class RxStompService extends RxStomp {
    protected readonly gameType: string = 'none';

    constructor() {
        super();
    }
}