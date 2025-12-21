import {Component, input} from '@angular/core';
import {GameMetadata} from "../../../../main/dto/games/GameMetadata";
import {GameState} from "../../dto/game/GameState";
import {ResultState} from "../../../../main/dto/all/result/ResultState";
import {
    GameResultTableComponent
} from "../../../../main/components/games/game-result-table/game-result-table.component";

import {JollyRoundTableComponent} from "../rounds-table/round-table.component";

@Component({
  selector: 'jolly-game-info',
  imports: [
    GameResultTableComponent,
    JollyRoundTableComponent
],
  templateUrl: './game-info.component.html',
  
  styleUrl: './game-info.component.css'
})
export class JollyGameInfoComponent {
  public metadata = input.required<GameMetadata>();
  public gameState = input.required<GameState>();
  public resultState = input.required<ResultState>();
}
