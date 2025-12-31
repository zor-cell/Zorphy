import {ChartData, ChartOptions, ChartTypeRegistry, FontSpec, Plugin} from "chart.js";

export abstract class BaseChart {
    protected static readonly colors = ['rgba(31, 119, 180, 0.8)', 'rgba(255, 127, 14, 0.8)', 'rgba(148, 103, 189, 0.8)', 'rgb(255, 187, 120, 0.8)'];

    protected static readonly titleFont: Partial<FontSpec> = {
        size: 18,
        weight: "bold"
    };

    protected static readonly axisFont: Partial<FontSpec> = {
        size: 14,
        weight: 'bold'
    };

    static options: ChartOptions = {
        maintainAspectRatio: false,
        animations: {
            x: {
                duration: 500,
                easing: 'easeOutQuart'
            },
            y: {
                duration: 500,
                easing: 'easeOutQuart'
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Chart',
                font: BaseChart.titleFont
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'X-Axis',
                    font: BaseChart.axisFont
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Y-Axis',
                    font: BaseChart.axisFont
                }
            }
        },
    };
}