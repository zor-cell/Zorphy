import {Component, input, Input, OnInit} from '@angular/core';
import {GameMetadata} from "../../../../main/dto/games/GameMetadata";
import {GameState} from "../../dto/game/GameState";
import {ResultState} from "../../../../main/dto/all/result/ResultState";

import {CatanHistogramComponent} from "../histogram/histogram.component";
import {GameMode, getGameModeName} from "../../dto/enums/GameMode";
import {GameResultTableComponent} from "../../../../main/components/games/game-result-table/game-result-table.component";

@Component({
  standalone: true,
  selector: 'catan-game-info',
  imports: [
    CatanHistogramComponent,
    GameResultTableComponent
],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css'
})
export class CatanGameInfoComponent implements OnInit {
  public metadata = input.required<GameMetadata>();
  public gameState = input.required<GameState>();
  public resultState = input.required<ResultState>();

  protected mean: number = 0;
  protected variance: number = 0;
  protected stdDev: number = 0;
  protected skew: number = 0;

  ngOnInit() {
    if(this.gameState()) {
      const diceSums = this.gameState().diceRolls.map(roll => roll.dicePair.dice1 + roll.dicePair.dice2);

      const mean = diceSums.reduce((acc, val) => acc + val, 0) / diceSums.length;
      const squaredDiffs = diceSums.map(val => Math.pow(val - mean, 2));
      const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / diceSums.length;
      const stdDev = Math.sqrt(variance);
      const skew = this.skewness(diceSums);

      this.mean = mean;
      this.variance = variance;
      this.stdDev = stdDev;
      this.skew = skew;
    }
  }

  private skewness(arr: number[]) {
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b, 0) / n;

    const s2 = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    const s = Math.sqrt(s2);

    const skew = arr.reduce((acc, val) => acc + Math.pow((val - mean) / s, 3), 0);

    return (n / ((n - 1) * (n - 2))) * skew;
  }

  protected readonly GameMode = GameMode;
  protected readonly getGameModeName = getGameModeName;
}
