import { HighResolutionTimestamp, type HighResolutionTimestampProvider } from '../domain';

export class PerformanceTimestamp implements HighResolutionTimestampProvider {
    public now(): HighResolutionTimestamp {
        return HighResolutionTimestamp.create(performance.now());
    }
}
