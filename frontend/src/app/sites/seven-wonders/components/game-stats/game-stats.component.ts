import {Component, input} from '@angular/core';
import {GameStats} from "../../dto/game/GameStats";

@Component({
  selector: 'seven-wonders-game-stats',
  imports: [],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css',
})
export class SevenWondersGameStatsComponent {
  public stats = input.required<GameStats>();
}
