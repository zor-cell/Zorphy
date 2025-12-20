import {Component, effect, inject, signal} from '@angular/core';
import {GameSessionConfigComponent} from "../../../all/components/game-session-config.component";
import {JollyService} from "../../jolly.service";
import {GameConfig} from "../../dto/game/GameConfig";
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {PlayerSelectComponent} from "../../../../main/components/all/player-select/player-select.component";
import {Team} from "../../../../main/dto/all/Team";
import {CustomValidators} from "../../../../main/classes/validators";
import {SliderCheckboxComponent} from "../../../../main/components/all/slider-checkbox/slider-checkbox.component";

@Component({
    selector: 'jolly-game-config',
    imports: [
        GameSessionConfigComponent,
        FormsModule,
        PlayerSelectComponent,
        ReactiveFormsModule,
        SliderCheckboxComponent
    ],
    templateUrl: './config.component.html',
    
    styleUrl: './config.component.css'
})
export class JollyConfigComponent {
    protected readonly projectName = "jolly";

    private fb = inject(NonNullableFormBuilder);
    protected jollyService = inject(JollyService);

    protected configForm = this.fb.group({
        teams: this.fb.control<Team[]>([], [CustomValidators.minArrayLength(2)]),
        roundLimit: this.fb.control({value: 5, disabled: true}, [Validators.min(1)]),
        noRoundLimit: this.fb.control(true)
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
        const roundLimitControl = this.configForm.controls.roundLimit;

        if (this.configForm.controls.noRoundLimit.value) {
            roundLimitControl.disable({emitEvent: false});
        } else {
            roundLimitControl.enable({emitEvent: false});
        }
    }
}
