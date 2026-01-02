import { type HighResolutionTimestampProvider } from '../domain';

export class PerformanceTimestampProvider implements HighResolutionTimestampProvider {
    public now(): number {
        return performance.now();
    }
}
