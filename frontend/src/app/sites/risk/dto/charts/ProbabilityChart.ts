import {BaseChart} from "../../../catan/dto/charts/BaseChart";
import {ChartData, ChartOptions} from "chart.js";
import {DataEntry} from "../DataEntry";
import {Range} from '../Range';

export class ProbabilityChart extends BaseChart {
  public data: ChartData<any, number[], number> = {
    labels: [],
    datasets: []
  };

  public options: ChartOptions = {
    maintainAspectRatio: false,
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