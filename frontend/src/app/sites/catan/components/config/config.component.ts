import {Component, effect, inject, signal} from '@angular/core';
import {SliderCheckboxComponent} from "../../../../main/components/all/slider-checkbox/slider-checkbox.component";
import { NgOptimizedImage } from "@angular/common";
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameConfig} from "../../dto/game/GameConfig";
import {CatanService} from "../../catan.service";
import {PlayerSelectComponent} from "../../../../main/components/all/player-select/player-select.component";
import {GameMode, getGameModeName} from "../../dto/enums/GameMode";
import {GameSessionConfigComponent} from "../../../all/components/game-session-config.component";
import {Team} from "../../../../main/dto/all/Team";
import {CustomValidators} from "../../../../main/classes/validators";

@Component({
    selector: 'catan-game-settings',
    imports: [
    SliderCheckboxComponent,
    NgOptimizedImage,
    FormsModule,
    PlayerSelectComponent,
    GameSessionConfigComponent,
    GameSessionConfigComponent,
    ReactiveFormsModule
],
    templateUrl: './config.component.html',
    
    styleUrl: './config.component.css'
})
export class CatanConfigComponent {
    private fb = inject(NonNullableFormBuilder);
    protected catanService = inject(CatanService);

    protected configForm = this.fb.group({
        teams: this.fb.control<Team[]>([], [CustomValidators.minArrayLength(2)]),
        gameMode: this.fb.control<GameMode>(GameMode.CITIES_AND_KNIGHTS),
        classicDice: this.fb.group({
            isBalanced: this.fb.control(true),
            shuffleThreshold: this.fb.control(5),
            useEvents: this.fb.control(false)
        }),
        eventDice: this.fb.group({
            isBalanced: this.fb.control(true),
            shuffleThreshold: this.fb.control(2),
            useEvents: this.fb.control(false)
        }),
        maxShipTurns: this.fb.control(7),
        initialShipTurns: this.fb.control(7)
    });
    protected readonly projectName = "catan";


    protected gameConfig = signal(this.configForm.getRawValue() as GameConfig);

    constructor() {
        //set signal when form changes
        this.configForm.valueChanges.subscribe(() => {
            this.gameConfig.set(this.configForm.getRawValue() as GameConfig);
        });

        //update form when signal changes
        effect(() => {
            this.configForm.patchValue(this.gameConfig(), {emitEvent: false});
        });
    }

    protected gameModes = Object.values(GameMode);
    protected readonly GameMode = GameMode;
    protected readonly getGameModeName = getGameModeName;
}
