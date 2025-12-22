import {Component, computed, input} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {BubbleDataPoint, Chart, ChartData, ChartOptions, ChartTypeRegistry, Point} from "chart.js";
import {CorrelationResult} from "../../../dto/stats/correlations/CorrelationResult";

@Component({
    selector: 'game-correlation-chart',
    imports: [
        BaseChartDirective
    ],
    templateUrl: './correlation-chart.component.html',
    styleUrl: './correlation-chart.component.css'
})
export class CorrelationChartComponent {
    public correlationData = input.required<CorrelationResult>();

    private colorLost = 'rgba(31, 119, 180, 0.8)';
    private colorWon = 'rgba(255, 127, 14, 0.8)';
    private colorLine = 'rgba(255, 0, 0, 0.8)'

    protected chartData = computed((): ChartData<any, number[], number> => {
        const data = this.correlationData();

        //regression line
        const xValues = data.points.map(p => p.x);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);

        const lineData = [
            {x: minX, y: data.slope * minX + data.intercept},
            {x: maxX, y: data.slope * maxX + data.intercept}
        ];

        //dynamic point radius for clusters
        const minRadius = 4;
        const maxRadius = 12;
        const pointCounts = data.points.reduce((acc, p) => {
            const key = `${p.x},${p.y}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const labels = [...new Set(xValues)].sort((a, b) => a - b);
        const dataPoints = data.points.map(p => {
            const count = pointCounts[`${p.x},${p.y}`];
            return {
                x: p.x,
                y: p.y,
                pointRadius: Math.min(minRadius + count - 1, maxRadius),
                backgroundColor: p.isWinner ? this.colorWon : this.colorLost
            };
        });

        return {
            labels: labels,
            datasets: [
                {
                    type: 'scatter',
                    data: dataPoints,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    pointRadius: dataPoints.map(p => p.pointRadius),
                    pointBackgroundColor: dataPoints.map(p => p.backgroundColor),
                    order: 1
                },
                {
                    type: 'line',
                    label: `Fit Line (r = ${data.coefficient.toFixed(2)})`,
                    data: lineData,
                    borderColor: this.colorLine,
                    backgroundColor: this.colorLine,
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    order: 2
                }
            ]
        };
    });

    protected chartOptions = computed((): ChartOptions => {
        return {
            maintainAspectRatio: false,
            animations: {
                // Define animations for dataset elements during updates
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
                    text: this.correlationData().metadata.title,
                    font: {
                        size: 18,
                        weight: 'bold',
                    },
                },
                legend: {
                    display: true,
                    labels: {
                        generateLabels: this.generateLabels.bind(this)
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: this.correlationData().metadata.xAxisTitle,
                        font: {
                            size: 16,
                        }
                    },
                    type: this.correlationData().metadata.xAxisType
                },
                y: {
                    title: {
                        display: true,
                        text: this.correlationData().metadata.yAxisTitle,
                        font: {
                            size: 16,
                        }
                    },
                    type: 'linear',
                    beginAtZero: true
                }
            },
        };
    });

    private generateLabels(chart: Chart<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint | null)[], unknown>) {
        const datasets = chart.data.datasets;

        const labels = [];

        // First, add the scatter dataset with custom entries for Won/Lost
        const scatterDataset = datasets.find(d => d.type === 'scatter');
        if (scatterDataset) {
            labels.push(
                {
                    text: 'Won',
                    fillStyle: this.colorWon,
                    strokeStyle: this.colorWon,
                    lineWidth: 2,
                    hidden: false,
                    datasetIndex: datasets.indexOf(scatterDataset)
                },
                {
                    text: 'Lost',
                    fillStyle: this.colorLost,
                    strokeStyle: this.colorLost,
                    lineWidth: 2,
                    hidden: false,
                    datasetIndex: datasets.indexOf(scatterDataset)
                }
            );
        }

        // Then, add the other datasets normally (like the fit line)
        datasets.forEach((d, i) => {
            if (d.type !== 'scatter') {
                labels.push({
                    text: d.label || `Dataset ${i}`,
                    fillStyle: d.borderColor,
                    strokeStyle: d.borderColor,
                    lineWidth: d.borderWidth || 2,
                    hidden: d.hidden ?? false,
                    datasetIndex: i
                });
            }
        });

        return labels;
    }
}
