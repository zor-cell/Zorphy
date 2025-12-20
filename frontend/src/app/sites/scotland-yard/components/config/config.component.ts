import {Component, inject, signal} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {ScotlandYardService} from "../../scotland-yard.service";
import {Team} from "../../../../main/dto/all/Team";
import {CustomValidators} from "../../../../main/classes/validators";
import {MapType} from "../../dto/MapType";
import {GameConfig} from "../../dto/game/GameConfig";
import {GameSessionConfigComponent} from "../../../all/components/game-session-config.component";
import {PlayerSelectComponent} from "../../../../main/components/all/player-select/player-select.component";
import {SliderCheckboxComponent} from "../../../../main/components/all/slider-checkbox/slider-checkbox.component";

import {GameMode, getGameModeName} from "../../../catan/dto/enums/GameMode";

@Component({
  selector: 'scotland-yard-game-config',
  imports: [
    GameSessionConfigComponent,
    PlayerSelectComponent,
    ReactiveFormsModule,
    SliderCheckboxComponent
],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ScotlandYardConfigComponent {
  protected readonly projectName = 'scotland-yard';

  private fb = inject(NonNullableFormBuilder);
  protected scotlandYardService = inject(ScotlandYardService);

  protected configForm = this.fb.group({
    teams: this.fb.control<Team[]>([]),
    mapType: this.fb.control<MapType>(MapType.LONDON),
  });
  protected gameConfig = signal(this.configForm.getRawValue() as GameConfig);


  protected mapTypes = Object.values(MapType);
}
