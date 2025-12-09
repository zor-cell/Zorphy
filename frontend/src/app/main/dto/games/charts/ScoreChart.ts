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
                type: "linear",
                title: {
                    display: true,
                    text: 'Game',
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
        data.entries.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            return dateA - dateB;
        });

        const dataPoints = data.entries.map((entry, i) => ({
            x: i + 1,
            y: entry.score,
            won: entry.won,
            label: new Date(entry.date).toLocaleString()
        }));
        console.log(dataPoints);

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