import {ChartData, ChartOptions} from "chart.js";
import {BaseChart} from "./BaseChart";
import {DiceRoll} from "../DiceRoll";

export class ClassicDiceChart extends BaseChart {
    public data: ChartData<any, number[], number> = {
        labels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        datasets: [
            {
                type: 'line',
                label: 'Bell Curve',
                data: [], // compute below
                tension: 0.4,
                pointRadius: 0,
                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                borderColor: 'rgba(255, 0, 0, 0.6)',
                borderWidth: 2,
                order: 1,
                yAxisID: 'y',
            },
            {
                type: 'line',
                label: 'Exact Probabilities',
                data: [], // compute below
                tension: 0,
                pointRadius: 0,
                borderColor: 'rgba(200, 200, 200, 0.8)',
                borderWidth: 2,
                order: 1,
                yAxisID: 'yLine', //this is not scaled correctly (is not really used anyway)
            }
        ]
    };

    public options: ChartOptions = {
        ...BaseChart.options,
        plugins: {
            ...BaseChart.options.plugins,
            legend: {
                labels: {
                    filter: item => item.text !== 'Bell Curve' && item.text !== 'Exact Probabilities'
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Dice Rolls',
                    font: BaseChart.axisFont
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Occurrences',
                    font: BaseChart.axisFont
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
            },
            yLine: {
                stacked: false,
                beginAtZero: true,
                display: false
            }
        }
    };

    public refresh(diceRolls: DiceRoll[], showExactProbabilities: boolean) {
        //bell curve
        this.data.datasets[0].data = this.generateBellCurveData(diceRolls.length);
        if(showExactProbabilities) {
            this.data.datasets[1].data = this.generateExactProbabilities(diceRolls.length);
        }

        //team datasets
        const teams = [...new Set(diceRolls.map(d => d.teamName))];
        const teamData: any = {};

        teams.forEach(team => {
            teamData[team] = Array(11).fill(0);
        });
        diceRolls.forEach(diceRoll => {
            const sum = diceRoll.dicePair.dice1 + diceRoll.dicePair.dice2;
            teamData[diceRoll.teamName][sum - 2]++;
        });

        const datasets = teams.map((team, index) => ({
            type: 'bar' as const,
            label: team,
            data: teamData[team],
            backgroundColor: BaseChart.colors[index % teams.length],
            order: 2
        }));

        this.data.datasets = [
            this.data.datasets[0],
            this.data.datasets[1],
            ...datasets];

        this.options = {
            ...this.options,
            plugins: {
                ...this.options.plugins,
                title: {
                    ...this.options.plugins?.title,
                    text: `Classic Dice Histogram of ${diceRolls.length} Rolls`,
                }
            },
        }
    }

    private generateBellCurveData(totalRolls: number): number[] {
        const mean = 7;
        const variance = 35 / 6;
        const stdDev = Math.sqrt(variance);

        // labels for sums 2 through 12
        const labels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        // Normal distribution formula (PDF):
        // f(x) = (1 / (σ * sqrt(2π))) * exp(-0.5 * ((x - μ)/σ)^2)
        return labels.map(x => {
            const z = (x - mean) / stdDev;
            const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
            return pdf * totalRolls;  // scale to total rolls so curve height matches histogram scale
        });
    }

    private generateExactProbabilities(totalRolls: number): number[] {
        const labels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        const probabilities: { [key: number]: number } = {
            2: 1 / 36,
            3: 2 / 36,
            4: 3 / 36,
            5: 4 / 36,
            6: 5 / 36,
            7: 6 / 36,
            8: 5 / 36,
            9: 4 / 36,
            10: 3 / 36,
            11: 2 / 36,
            12: 1 / 36
        };

        return labels.map(sum => probabilities[sum] * totalRolls);
    }
}
