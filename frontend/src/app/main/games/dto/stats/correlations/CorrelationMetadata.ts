export interface CorrelationMetadata {
    title: string,
    xAxisTitle: string,
    yAxisTitle: string,
    xAxisType: ("time" | "linear" | "logarithmic" | "category" | "timeseries" | "radialLinear" | undefined)
}