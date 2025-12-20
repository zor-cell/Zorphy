import {Component, effect, inject, signal} from '@angular/core';
import {QwirkleService} from "../../qwirkle.service";
import {GameConfig} from "../../dto/game/GameConfig";
import {GameSessionConfigComponent} from "../../../all/components/game-session-config.component";
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";

import {PlayerSelectComponent} from "../../../../main/components/all/player-select/player-select.component";
import {Team} from "../../../../main/dto/all/Team";
import {CustomValidators} from "../../../../main/classes/validators";

@Component({
    selector: 'qwirkle-game-config',
    imports: [
    GameSessionConfigComponent,
    FormsModule,
    PlayerSelectComponent,
    ReactiveFormsModule
],
    templateUrl: './config.component.html',
    
    styleUrl: './config.component.css'
})
export class QwirkleConfigComponent {
    protected readonly projectName = "qwirkle";

    private fb = inject(NonNullableFormBuilder);
    protected qwirkleService = inject(QwirkleService);

    protected configForm = this.fb.group({
        teams: this.fb.control<Team[]>([], [CustomValidators.minArrayLength(1)]),
        playingTeam: this.fb.control({value: -1, disabled: true})
    });

    protected gameConfig = signal(this.configForm.getRawValue() as GameConfig);

    constructor() {
        //set signal when form changes
        this.configForm.valueChanges.subscribe(() => {
            this.gameConfig.set(this.configForm.getRawValue() as GameConfig);
            this.updateDependantControls();
        });

        //update form when signal changes
        effect(() => {
            this.configForm.patchValue(this.gameConfig(), {emitEvent: false});
            this.updateDependantControls();
        });
    }

    private updateDependantControls() {
        const playingControl = this.configForm.controls.playingTeam;

        const length = this.configForm.controls.teams.value.length;
        if (length === 0) {
            playingControl.disable({emitEvent: false});
            playingControl.setValue(-1, {emitEvent: false});
        } else {
            playingControl.enable({emitEvent: false});

            // If current value is invalid (-1 or out of bounds), reset to 0
            if (playingControl.value < 0 || playingControl.value >= length) {
                playingControl.setValue(0, {emitEvent: false});
            }
        }
    }
}
