import {Component, effect, inject, signal} from '@angular/core';
import {GameSessionConfigComponent} from "../../../core/http/components/game-session-config.component";
import {SevenWondersService} from "../../seven-wonders.service";
import {Team} from "../../../../main/core/dto/Team";
import {CustomValidators} from "../../../../main/core/validators";
import {NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {GameMode, getGameModeName} from "../../dto/enums/GameMode";
import {GameConfig} from "../../dto/game/GameConfig";
import {PlayerSelectComponent} from "../../../../main/core/components/player-select/player-select.component";

@Component({
  selector: 'seven-wonders-game-config',
  imports: [
    GameSessionConfigComponent,
    ReactiveFormsModule,
    PlayerSelectComponent
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
})
export class SevenWondersConfigComponent {
  private fb = inject(NonNullableFormBuilder);
  protected sevenWondersService = inject(SevenWondersService);

  protected readonly projectName = "seven-wonders";
  protected configForm = this.fb.group({
    teams: this.fb.control<Team[]>([], [CustomValidators.minArrayLength(2)]),
    gameMode: this.fb.control<GameMode>(GameMode.DUEL)
  });


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
