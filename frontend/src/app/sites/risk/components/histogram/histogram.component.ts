import {Component, computed, effect, input, linkedSignal, signal, untracked, viewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {DataEntry} from "../../dto/DataEntry";
import {MatSlider, MatSliderRangeThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {Range} from '../../dto/Range';
import {ProbabilityChart} from "../../dto/charts/ProbabilityChart";
import {Plugin} from 'chart.js';

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
  private chart = viewChild.required(BaseChartDirective);

  public dataEntries = input.required<DataEntry[]>();
  public isVisible = input<boolean>(true);

  protected labels = computed(() => {
    const entries = this.dataEntries();
    if (entries.length === 0) return [];

    const min = Math.min(...entries.map(e => e.result));
    const max = Math.max(...entries.map(e => e.result));

    const continuousArr = [];
    for (let i = min; i <= max; i++) {
      continuousArr.push(i);
    }
    return continuousArr;
  });

  protected totalRange = computed<Range | null>(() => {
    const labels = this.labels();
    if(labels.length === 0) {
      return null;
    }

    return {
      min: Math.min(...labels),
      max: Math.max(...labels)
    }
  });

  protected selectedRange = linkedSignal<Range>(() => {
    const total = this.totalRange();

    return {
      min: 1,
      max: total ? total.max : 1
    };
  });

  protected probability = computed(() => {
    const min = this.selectedRange().min;
    const max = this.selectedRange().max;
    const entries = this.dataEntries();

    const totalCount = entries.reduce((sum, e) => sum + e.count, 0);
    if (totalCount === 0) return 0;

    const inRangeCount = entries
      .filter(e => e.result >= min && e.result <= max)
      .reduce((sum, e) => sum + e.count, 0);

    return inRangeCount / totalCount;
  });

  protected probabilityChart = new ProbabilityChart();

  constructor() {
    effect(() => {
      const entries = this.dataEntries();
      if(entries) {
        const currentRange = untracked(() => this.selectedRange());
        this.probabilityChart.refresh(entries, currentRange);

        this.chart().update();
      }
    });

    effect(() => {
      this.probabilityChart.refreshSlider(this.selectedRange());
      this.chart().update('none');
    });
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

  protected readonly input = input;
}
