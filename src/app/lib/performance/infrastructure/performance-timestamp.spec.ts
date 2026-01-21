import { HighResolutionTimestamp } from '../domain';

import { PerformanceTimestamp } from './performance-timestamp';

describe(PerformanceTimestamp, () => {
    test('should return timestamp from performance.now()', () => {
        // Given
        const performanceNowSpy = vi.spyOn(performance, 'now').mockReturnValueOnce(78343.570643);
        const performanceTimestampProvider = new PerformanceTimestamp();

        // When
        const now = performanceTimestampProvider.now();

        // Then
        expect(now).toBeInstanceOf(HighResolutionTimestamp);
        expect(now.value).toBe(78343.570643);
        expect(performanceNowSpy).toHaveBeenCalledTimes(1);
    });

    test('should return different values when performance.now() changes', () => {
        // Given
        const performanceNowSpy = vi.spyOn(performance, 'now')
            .mockReturnValueOnce(78343.570643)
            .mockReturnValueOnce(78344.123456);
        const performanceTimestampProvider = new PerformanceTimestamp();

        // When
        const firstCall = performanceTimestampProvider.now();
        const secondCall = performanceTimestampProvider.now();

        // Then
        expect(firstCall.value).toBe(78343.570643);
        expect(secondCall.value).toBe(78344.123456);
        expect(performanceNowSpy).toHaveBeenCalledTimes(2);
    });
});
