import {BaseChart} from "../../../catan/dto/charts/BaseChart";
import {BarElement, ChartData, ChartOptions, Plugin} from "chart.js";
import {DataEntry} from "../DataEntry";
import {Range} from '../Range';
import {signal} from "@angular/core";
import {Position} from "../../../../main/core/dto/Position";

export class ProbabilityChart extends BaseChart {
  public data: ChartData<any, number[], number> = {
    labels: [],
    datasets: []
  };

  public options: ChartOptions = {
    maintainAspectRatio: false,
    transitions: {
      resize: {
        animation: {
          duration: 0
        }
      }
    },
    animations: {
      x: {
        duration: 500,
        easing: 'easeOutQuart'
      },
      y: {
        duration: 500,
        easing: 'easeOutQuart'
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Histogram of Attacks',
        font: {
          size: 18,
          weight: 'bold',
        },
      }
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true,
      }
    },
  };

  public plugins: Plugin[] = [{
    id: 'sync-slider-bounds',
    afterLayout: (chart) => {
      const {top, left, right, bottom} = chart.chartArea;
      this.chartBounds.set({
        x: left,
        y: top
      });

      const meta = chart.getDatasetMeta(0);

      if (meta && meta.data && meta.data.length > 0) {
        const firstBar = meta.data[0] as BarElement;
        const lastBar = meta.data[meta.data.length - 1];

        const leftOffset = firstBar.x;
        const rightOffset = chart.width - lastBar.x;

        let width = firstBar.getProps(['width'], true)?.width ?? 0;
        width = Math.max(Math.min(width / 2, 12), 8);

        console.log(leftOffset, rightOffset);
        const distFromBottom = chart.height - bottom;

        this.chartSliderInfo.set({
          left: leftOffset - 3,
          right: rightOffset - 3,
          bottom: distFromBottom - 24,
          size: width
        });
      }
    }
  }];

  public chartSliderInfo = signal<SliderInfo>({left: 0, right: 0, bottom: 0, size: 0});
  public chartBounds = signal<Position>({x: 0, y: 0});

  public refresh(data: DataEntry[], range: Range | null = null) {
    //get labels
    const min = Math.min(...data.map(e => e.result));
    const max = Math.max(...data.map(e => e.result));

    const labels = [];
    for (let i = min; i <= max; i++) {
      labels.push(i);
    }

    //get data counts
    const labelData = new Array(labels.length).fill(0);

    labels.forEach((label, i) => {
      const entry: DataEntry = data.find(x => x.result == label)!;
      labelData[i] = entry?.count ?? 0;
    });

    //get probabilities from counts
    const total = labelData.reduce((a, b) => a + b, 0);
    const probabilities = labelData.map(d => d / total);

    //bar colors
    let colors: string[] = [];
    if(range) {
      colors = labels.map(label => {
        return (label >= range.min && label <= range.max)
          ? BaseChart.colors[0]
          : 'rgba(54, 162, 235, 0.2)';
      });
    }

    const dataset = {
      type: 'bar',
      label: 'Attackers left',
      data: probabilities,
      backgroundColor: colors,
    };

    this.data.labels = labels;
    this.data.datasets = [dataset];
  }

  public refreshSlider(selectedRange: Range) {
    if(this.data.labels) {
      this.data.datasets[0].backgroundColor = this.data.labels.map(label => {
        return (label >= selectedRange.min && label <= selectedRange.max)
          ? BaseChart.colors[0]
          : 'rgba(54, 162, 235, 0.2)';
      });
    }
  }
}

export interface SliderInfo {
  left: number;
  right: number;
  bottom: number;
  size: number;
}