import {Component, input} from '@angular/core';
import {GameMetadata} from "../../../../main/games/dto/GameMetadata";
import {DefaultResultState} from "../../../core/http/dto/result/DefaultResultState";
import {GameState} from "../../dto/game/GameState";
import {DuelResultState} from "../../dto/result/DuelResultState";
import {
  GameResultTableComponent
} from "../../../../main/games/components/game-result-table/game-result-table.component";
import {JollyRoundTableComponent} from "../../../jolly/components/rounds-table/round-table.component";
import {SevenWondersResultTableComponent} from "../result-table/result-table.component";

@Component({
  selector: 'seven-wonders-game-info',
  imports: [
    SevenWondersResultTableComponent
  ],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css',
})
export class SevenWondersGameInfoComponent {
  public metadata = input.required<GameMetadata>();
  public gameState = input.required<GameState>();
  public resultState = input.required<DuelResultState>();
}
