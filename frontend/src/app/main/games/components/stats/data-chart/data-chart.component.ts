import {AfterViewInit, Component, input, viewChildren} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ScoreChart} from "../../../dto/charts/ScoreChart";
import {ChartDataHistory} from "../../../dto/stats/charts/ChartDataHistory";

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
