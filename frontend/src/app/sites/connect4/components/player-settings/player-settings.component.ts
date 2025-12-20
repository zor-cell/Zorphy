import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerConfig, Version} from "../../dto/data";

import {FormsModule} from "@angular/forms";

@Component({
    selector: 'connect4-player-settings',
    imports: [
    FormsModule
],
    templateUrl: './player-settings.component.html',
    standalone: true,
    styleUrl: './player-settings.component.css'
})
export class PlayerSettingsComponent implements OnInit {
    @Input({required: true}) playerValue!: number;
    @Input() canStart: boolean = false;
    @Input() isAi: boolean = false;
    @Input() maxTime: number = 3000;
    @Input() maxMemory: number = 64;
    @Input() version: Version = Version.V2_1;
    @Output() settingsEvent = new EventEmitter<PlayerConfig>();
    @Output() makeMoveEvent = new EventEmitter<PlayerConfig>();

    //local variables to not modify inputs
    localPlayerValue!: number;
    localIsAi!: boolean;
    localMaxTime!: number;
    localMaxMemory!: number;
    localVersion!: Version;

    get config(): PlayerConfig {
        return {
            value: this.localPlayerValue,
            isAi: this.localIsAi,
            maxTime: this.localMaxTime,
            maxMemory: this.localMaxMemory,
            version: this.localVersion
        };
    }

    ngOnInit() {
        this.localPlayerValue = this.playerValue;
        this.localIsAi = this.isAi;
        this.localMaxTime = this.maxTime;
        this.localMaxMemory = this.maxMemory;
        this.localVersion = this.version;

        //call config update in zero delay timeout so it
        //is called in the next js macrotask cycle
        setTimeout(() => this.sendConfig());
    }

    updateIsAi(checked: boolean) {
        this.localIsAi = checked;
        this.sendConfig();
    }

    sendConfig() {
        this.settingsEvent.emit(this.config);
    }

    sendMakeMove() {
        this.makeMoveEvent.emit(this.config);
    }

    protected readonly Version = Version;
}
