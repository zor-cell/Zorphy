import {Component, computed, input} from '@angular/core';
import {GameMetadata} from "../../../../main/games/dto/GameMetadata";
import {GameState} from "../../dto/game/GameState";
import {ResultState} from "../../../../main/core/dto/result/ResultState";

import {CatanHistogramComponent} from "../histogram/histogram.component";
import {GameMode, getGameModeName} from "../../dto/enums/GameMode";
import {
    GameResultTableComponent
} from "../../../../main/games/components/game-result-table/game-result-table.component";

@Component({
  
  selector: 'catan-game-info',
  imports: [
    CatanHistogramComponent,
    GameResultTableComponent
],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css'
})
export class CatanGameInfoComponent {
  public metadata = input.required<GameMetadata>();
  public gameState = input.required<GameState>();
  public resultState = input.required<ResultState>();

  private diceSums = computed(() => {
    return this.gameState().diceRolls.map(roll => roll.dicePair.dice1 + roll.dicePair.dice2);
  });

  protected mean = computed(() => {
    const sums = this.diceSums();
    return sums.reduce((acc, val) => acc + val, 0) / sums.length;
  });

  protected variance = computed(() => {
    const sums = this.diceSums();
    const squaredDiffs = sums.map(val => Math.pow(val - this.mean(), 2));

    return squaredDiffs.reduce((acc, val) => acc + val, 0) / sums.length;
  });

  protected stdDev = computed(() => {
    return Math.sqrt(this.variance());
  });

  protected skew = computed(() => {
    const sums = this.diceSums();

    const n = sums.length;
    const mean = sums.reduce((a, b) => a + b, 0) / n;

    const s2 = sums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    const s = Math.sqrt(s2);

    const skew = sums.reduce((acc, val) => acc + Math.pow((val - mean) / s, 3), 0);

    return (n / ((n - 1) * (n - 2))) * skew;
  });

  protected readonly GameMode = GameMode;
  protected readonly getGameModeName = getGameModeName;
}
