import {AfterViewInit, Component, input, viewChildren} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ScoreChart} from "../../../dto/charts/ScoreChart";
import {ChartDataHistory} from "../../../dto/stats/charts/ChartDataHistory";

@Component({
  selector: 'game-data-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './score-chart.component.html',
  styleUrl: './score-chart.component.css'
})
export class ScoreChartComponent implements AfterViewInit {
  private charts = viewChildren(BaseChartDirective);
  public chartData = input.required<ChartDataHistory>();

  protected scoreChart = new ScoreChart();

  ngAfterViewInit(): void {
    this.refillChartData();
  }

  private refillChartData() {
    this.scoreChart.refresh(this.chartData());

    //update chart changes
    this.charts().forEach(chart => {
      chart.update();
    });
  }
}
