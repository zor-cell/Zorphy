import {ChartData, ChartOptions} from "chart.js";
import {BaseChart} from "./BaseChart";
import {DiceRoll} from "../DiceRoll";
import {GameMode} from "../enums/GameMode";

export class MoveTimeChart extends BaseChart {
    static override data : ChartData<any, number[], number> = {
        labels: [1, 2, 3],
        datasets: []
    };

    static override options : ChartOptions = {
        ...BaseChart.options,
        scales: {
            x: {
                stacked: false,
                title: {
                    display: true,
                    text: 'Round',
                    font: BaseChart.axisFont
                }
            },
            y: {
                stacked: false,
                title: {
                    display: true,
                    text: 'Move Time (s)',
                    font: BaseChart.axisFont
                },
                beginAtZero: true
            },
            yMinutes: {
                stacked: false,
                position: 'right',
                title: {
                    display: true,
                    text: 'Move Time (min)',
                    font: BaseChart.axisFont
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: (value) => {
                        const seconds = typeof value === 'string' ? parseFloat(value) : value;

                        if(seconds % 60 == 0) {
                            return (seconds / 60).toFixed(0);
                        }

                        return null;
                    }
                },
                afterDataLimits: (scale) => {
                    const secondsScale = scale.chart.scales['y'];
                    if (secondsScale) {
                        scale.max = secondsScale.max;
                        scale.min = secondsScale.min;
                    }
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        },
        plugins: {
            ...BaseChart.options.plugins,
            title: {
                display: true,
                text: 'Round Move Times',
                font: BaseChart.titleFont
            }
        },
        elements: {
            line: {
                tension: 0.2,
                borderWidth: 2,
                fill: false,
            },
            point: {
                radius: 3,
            }
        },
    };

    static refresh(diceRolls: DiceRoll[], gameMode: GameMode | null) {
        //team datasets
        const teams = [...new Set(diceRolls.map(d => d.teamName))];
        const teamData: any = {};
        const maxRounds = Math.ceil(diceRolls.length / teams.length);

        teams.forEach(team => {
            teamData[team] = Array(maxRounds).fill(null);
        });
        diceRolls.forEach((diceRoll, i) => {
            if (i < diceRolls.length - 1) {
                if (!diceRolls[i].rollTime || !diceRolls[i + 1].rollTime) return;

                const cur = new Date(diceRolls[i].rollTime);
                const next = new Date(diceRolls[i + 1].rollTime);

                const duration = (next.getTime() - cur.getTime()) / 1000;

                let round: number = Math.floor(i / teams.length);

                if (gameMode === GameMode.ONE_VS_ONE) {
                    //two consecutive rolls from the same team -> 4 rows are 2 rounds
                    round = Math.floor(i / 4);
                    const offset = i % 2;
                    round += offset;
                }

                teamData[diceRoll.teamName][round] = duration;
            }
        });

        const datasets = teams.map((team, index) => ({
            type: 'line',
            label: team,
            data: teamData[team],
            borderColor: BaseChart.colors[index % BaseChart.colors.length],
            backgroundColor: BaseChart.colors[index % teams.length],
            fill: false,
            order: 2,
            yAxisID: 'y'
        }));

        const newLabels = Array.from(
            {length: maxRounds},
            (_, i) => i + 1
        );

        MoveTimeChart.data = {
            ...MoveTimeChart.data,
            labels: newLabels,
            datasets: [...datasets]
        }
    }
}