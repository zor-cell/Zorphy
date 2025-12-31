import {Component, computed, effect, input, signal, viewChild, viewChildren} from '@angular/core';
import {ChartData, ChartOptions} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {ClassicDiceChart} from "../../../../sites/catan/dto/charts/ClassicDiceChart";
import {EventDiceChart} from "../../../../sites/catan/dto/charts/EventDiceChart";
import {MoveTimeChart} from "../../../../sites/catan/dto/charts/MoveTimeChart";
import {DiceRoll} from "../../../../sites/catan/dto/DiceRoll";

@Component({
  selector: 'app-replay-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './replay-chart.component.html',
  styleUrl: './replay-chart.component.css',
})
export class ReplayChartComponent {
  private chart = viewChild.required(BaseChartDirective);

  public data = input.required<ChartData>();
  public options = input.required<ChartOptions>();
  public diceRolls = input.required<DiceRoll[]>();
  public canReplay = input<boolean>(true);

  protected isPlaying = signal<boolean>(false);
  protected replayIndex = signal<number>(0);
  protected displayedRolls = computed(() => {
    const rolls = [...this.diceRolls()].sort((a, b) => {
      return new Date(a.rollTime).getTime() - new Date(b.rollTime).getTime();
    });

    if(!this.isPlaying()) {
      return rolls;
    }

    return rolls.slice(0, this.replayIndex());
  });
  private playbackInterval: any;

  protected toggleReplay() {
    if (this.isPlaying()) {
      this.stop();
    } else {
      this.start();
    }
  }

  private start() {
    if (this.replayIndex() >= this.diceRolls().length) {
      this.replayIndex.set(0);
    }

    this.isPlaying.set(true);
    this.playbackInterval = setInterval(() => {
      this.replayIndex.update(idx => {
        if (idx >= this.diceRolls().length) {
          this.stop();
          return idx;
        }
        return idx + 1;
      });
    }, 600);
  }

  private stop() {
    this.isPlaying.set(false);
    clearInterval(this.playbackInterval);
  }
}
