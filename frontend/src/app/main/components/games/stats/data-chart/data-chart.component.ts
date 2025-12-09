import {AfterViewInit, Component, input, viewChildren} from '@angular/core';
import {ChartData} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {ScoreChart} from "../../../../dto/games/charts/ScoreChart";
import {ClassicDiceChart} from "../../../../../sites/catan/dto/charts/ClassicDiceChart";
import {EventDiceChart} from "../../../../../sites/catan/dto/charts/EventDiceChart";
import {MoveTimeChart} from "../../../../../sites/catan/dto/charts/MoveTimeChart";
import {ChartDataHistory} from "../../../../dto/games/stats/ChartDataHistory";

@Component({
  selector: 'game-data-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './data-chart.component.html',
  styleUrl: './data-chart.component.css'
})
export class DataChartComponent implements AfterViewInit {
  private charts = viewChildren(BaseChartDirective);
  public chartData = input.required<ChartDataHistory>();

  private colorLost = 'rgba(31, 119, 180, 0.8)';
  private colorWon = 'rgba(255, 127, 14, 0.8)';


  ngAfterViewInit(): void {
    this.refillChartData();
  }

  private refillChartData() {
    ScoreChart.refresh(this.chartData());

    //update chart changes
    this.charts().forEach(chart => {
      chart.update();
    });
  }

  protected readonly ScoreChart = ScoreChart;
}
