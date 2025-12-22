import {CorrelationDataPoint} from "./CorrelationDataPoint";
import {CorrelationMetadata} from "./CorrelationMetadata";

export interface CorrelationResult {
    metadata: CorrelationMetadata,
    coefficient: number,
    slope: number,
    intercept: number,
    points: CorrelationDataPoint[]
}