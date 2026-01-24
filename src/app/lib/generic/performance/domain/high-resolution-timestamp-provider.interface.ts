import { type HighResolutionTimestamp } from './high-resolution-timestamp';

export interface HighResolutionTimestampProvider {
    now(): HighResolutionTimestamp;
}
