import {AfterViewInit, Component, computed, effect, input, signal, viewChild, viewChildren} from '@angular/core';
import {ChartData, ChartOptions} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {ClassicDiceChart} from "../../../../sites/catan/dto/charts/ClassicDiceChart";
import {EventDiceChart} from "../../../../sites/catan/dto/charts/EventDiceChart";
import {MoveTimeChart} from "../../../../sites/catan/dto/charts/MoveTimeChart";
import {DiceRoll} from "../../../../sites/catan/dto/DiceRoll";
import {BaseChart} from "../../../../sites/catan/dto/charts/BaseChart";

@Component({
  selector: 'app-replay-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './replay-chart.component.html',
  styleUrl: './replay-chart.component.css',
})
export class ReplayChartComponent implements AfterViewInit {
  private chart = viewChild.required(BaseChartDirective);

  public chartInstance = input.required<BaseChart>();
  public data = input.required<any[]>();
  public canReplay = input<boolean>(true);

  protected isPlaying = signal<boolean>(false);
  protected replayIndex = signal<number>(-1);

  private playbackInterval: any;

  constructor() {
    effect(() => {
      this.updateChart();
    });
  }

  private updateChart() {
    const chart = this.chart();
    const data = this.data();
    const index = this.replayIndex();
    const instance = this.chartInstance();

    if(!chart || !chart.chart) return;
    console.log(index)

    if(index < 0 || index >= data.length) {
      instance.refresh(data);
    } else {
      instance.refreshSlice(data.slice(0, index), data);
    }

    if(chart && chart.chart) {
      console.log("update")
      chart.update('none');
    }
  }

  ngAfterViewInit() {
    this.updateChart();
    //TODO: this is hacky
    setTimeout(() => this.chart().update(), 0)
  }

  protected toggleReplay() {
    if (this.isPlaying()) {
      this.stop();
    } else {
      this.start();
    }
  }

  private start() {
    if (this.replayIndex() < 0 || this.replayIndex() >= this.data().length) {
      this.replayIndex.set(0);
    }

    this.isPlaying.set(true);
    this.playbackInterval = setInterval(() => {
      this.replayIndex.update(idx => {
        if (idx >= this.data().length) {
          this.stop();
          return -1;
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
