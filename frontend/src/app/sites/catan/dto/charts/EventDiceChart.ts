import {ChartData, ChartOptions, Plugin} from "chart.js";
import {BaseChart} from "./BaseChart";
import {DiceRoll} from "../DiceRoll";

export class EventDiceChart extends BaseChart {
    private static labelImages: Record<string, HTMLImageElement> = {
        g: Object.assign(new Image(), { src: 'assets/catan/g.svg' }),
        b: Object.assign(new Image(), { src: 'assets/catan/b.svg' }),
        y: Object.assign(new Image(), { src: 'assets/catan/y.svg' }),
        e: Object.assign(new Image(), { src: 'assets/catan/e.svg' })
    }

    private static labelImagePlugin: Plugin<any> = {
        id: 'labelImagePlugin',
        afterDraw(chart: any) {
            const { ctx, chartArea, scales } = chart;
            const xAxis = scales.x;

            if (!xAxis) return;

            chart.data.labels.forEach((label: string, index: number) => {
                const image = EventDiceChart.labelImages[label];
                if (!image?.complete) return; // skip if not loaded yet

                const x = xAxis.getPixelForTick(index);
                const y = chartArea.bottom + 5; // space below axis

                const size = 20; // image size (px)
                ctx.drawImage(image, x - size / 2, y, size, size);
            });
        }
    };

    public data: ChartData<any, number[], string> = {
        labels: ['g', 'b', 'y', 'e'],
        datasets: [
            {
                type: 'line',
                label: 'Expectation',
                data: [],
                tension: 0,
                pointRadius: 0,
                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                borderColor: 'rgba(255, 0, 0, 0.6)',
                borderWidth: 2,
                order: 1,
                yAxisID: 'y'
            },
        ]
    }

    public options: ChartOptions = {
        ...BaseChart.options,
        plugins: {
            ...BaseChart.options.plugins,
            title: {
                display: true,
                text: 'Event Dice Histogram',
                font: BaseChart.titleFont
            },
            legend: {
                labels: {
                    filter: item => item.text !== 'Expectation'
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Event Dice Rolls',
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
            }
        }
    }

    public plugins: Plugin[] = [EventDiceChart.labelImagePlugin];

    public refresh(diceRolls: DiceRoll[]) {
        diceRolls = diceRolls.filter(d => d.diceEvent != null);

        this.data.datasets[0].data = this.generatePMF(diceRolls.length);

        //team datasets
        const teams = [...new Set(diceRolls.map(d => d.teamName))];
        const teamData: any = {};

        teams.forEach(team => {
            teamData[team] = Array(4).fill(0);
        });
        diceRolls.forEach(diceRoll => {
            const pos = this.data.labels?.indexOf(diceRoll.diceEvent);
            if(pos !== undefined) {
                teamData[diceRoll.teamName][pos]++;
            }
        });

        const datasets = teams.map((team, index) => ({
            type: 'bar',
            label: team,
            data: teamData[team],
            backgroundColor: BaseChart.colors[index % teams.length],
            order: 2
        }));

        this.data.datasets = [
            this.data.datasets[0],
            ...datasets
        ];

        this.options = {
            ...this.options,
            plugins: {
                ...this.options.plugins,
                title: {
                    ...this.options.plugins?.title,
                    text: `Event Dice Histogram of ${diceRolls.length} Rolls`,
                }
            },
        }
    }

    private generatePMF(totalRolls: number) {
        const probabilities: { [key: string]: number } = {
            'g': 1 / 6,
            'b': 1 / 6,
            'y': 1 / 6,
            'e': 3 / 6,
        };

        return this.data.labels?.map(l => probabilities[l] * totalRolls);
    }
}