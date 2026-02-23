import {Component, computed, effect, input, linkedSignal, signal, viewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {DataEntry} from "../../dto/DataEntry";
import {ChartData, ChartOptions} from "chart.js";
import {MatSlider, MatSliderRangeThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";

interface Range {
  min: number;
  max: number;
}

@Component({
  selector: 'risk-histogram',
  imports: [
    BaseChartDirective,
    MatSlider,
    MatSliderRangeThumb,
    FormsModule
  ],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.css'
})
export class RiskHistogramComponent {
  public dataEntries = input.required<DataEntry[]>();
  public isVisible = input<boolean>(true);
  private chart = viewChild.required(BaseChartDirective);

  protected totalRange = computed<Range>(() => {
    const labels = this.labels();
    if(labels.length === 0) {
      return {
        min: 0,
        max: 0,
      };
    }

    return {
      min: Math.min(...labels),
      max: Math.max(...labels)
    }
  });
  protected selectedRange = linkedSignal<Range>(() => this.totalRange());

  protected labels = computed(() => {
    return this.dataEntries().map(d => d.result).sort((a, b) => a - b);
  });

  protected labelData = computed(() => {
    const a = new Array(this.labels().length).fill(0);

    this.labels().forEach((label, i) => {
      const entry: DataEntry = this.dataEntries().find(x => x.result == label)!;
      a[i] = entry.count;
    });

    return a;
  });

  protected labelDataProb = computed(() => {
    const total = this.labelData().reduce((a, b) => a + b, 0);
    return this.labelData().map(d => d / total);
  });

  protected probability = computed(() => {
    const min = this.selectedRange().min;
    const max = this.selectedRange().max;

    let sum = 0;
    this.labels().forEach((label, i) => {
      if (label >= min && label <= max) {
        sum += this.labelDataProb()[i];
      }
    });

    return sum;
  });

  protected barColors = computed(() => {
    const min = this.selectedRange().min;
    const max = this.selectedRange().max;

    return this.labels().map(label => {
      // 100% opacity for bars in range, 20% opacity for bars outside
      return (label >= min && label <= max)
        ? 'rgba(54, 162, 235, 0.8)'
        : 'rgba(54, 162, 235, 0.4)';
    });
  });

  protected chartData: ChartData<any, number[], number> = {
    labels: [],
    datasets: []
  };
  protected chartOptions: ChartOptions = {
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

  constructor() {
    effect(() => {
      if(this.dataEntries()) {
        this.refillChartData();
      }
    });

    //update chart colors for selection
    effect(() => {
      const colors = this.barColors();
      const chartInstance = this.chart();

      if (chartInstance && this.chartData.datasets.length > 0) {
        this.chartData.datasets[0].backgroundColor = colors;
        chartInstance.update();
      }
    });
  }

  private refillChartData() {
    const dataset = {
      type: 'bar',
      label: 'Attackers left',
      data: this.labelDataProb()
    };

    this.chartData.labels = this.labels();
    this.chartData.datasets = [dataset];

    this.chart().update();
  }

  protected updateRange(isMax: boolean, value: number) {
    this.selectedRange.update(currentRange => {
      if (isMax) {
        return { ...currentRange, max: value };
      } else {
        return { ...currentRange, min: value };
      }
    });
  }
}
