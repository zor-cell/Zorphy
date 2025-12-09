import {BaseChart} from "../../../../sites/catan/dto/charts/BaseChart";
import {ChartData, ChartOptions} from "chart.js";
import {DiceRoll} from "../../../../sites/catan/dto/DiceRoll";
import {GameMode} from "../../../../sites/catan/dto/enums/GameMode";
import {MoveTimeChart} from "../../../../sites/catan/dto/charts/MoveTimeChart";
import {ChartDataHistory} from "../stats/ChartDataHistory";

export class ScoreChart extends BaseChart {
    static override data: ChartData<any, number[], number> = {
        datasets: []
    }

    static override options: ChartOptions = {
        ...BaseChart.options,
        scales: {
            x: {
                type: "category",
                title: {
                    display: true,
                    text: 'Date',
                    font: BaseChart.axisFont
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Score',
                    font: BaseChart.axisFont
                },
                beginAtZero: true
            }
        },
        plugins: {
            ...BaseChart.options.plugins,
            title: {
                display: true,
                text: 'Score History',
                font: BaseChart.titleFont
            }
        },
        elements: {
            line: {
                tension: 0.2,
                borderWidth: 1,
                fill: false,
            },
            point: {
                radius: 3,
            }
        },
    }

    static refresh(data: ChartDataHistory) {
        const dataPoints = data.entries.map(entry => ({
            x: new Date(entry.date).toLocaleString(),
            y: entry.score,
            won: entry.won
        }));

        const pointColors = data.entries.map(entry =>
            entry.won ? '#4caf50' : '#f44336'
        );

        ScoreChart.data.datasets = [{
            type: 'line',
            label: 'Score',
            data: dataPoints,
            pointBackgroundColor: pointColors,
            pointBorderColor: pointColors,
            borderColor: BaseChart.colors[0],
            backgroundColor: BaseChart.colors[0],
        }];
    }
}