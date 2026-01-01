import { type HighResolutionTimestampProvider } from './high-resolution-timestamp-provider.interface';

export class PerformanceTimestampProvider implements HighResolutionTimestampProvider {
    public now(): number {
        return performance.now();
    }
}
