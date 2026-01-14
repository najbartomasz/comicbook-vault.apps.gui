import { PerformanceTimestampProvider } from './performance-timestamp-provider';

describe(PerformanceTimestampProvider, () => {
    test('should return timestamp from performance.now()', () => {
        // Given
        const performanceNowSpy = vi.spyOn(performance, 'now').mockReturnValueOnce(78343.570643);
        const performanceTimestampProvider = new PerformanceTimestampProvider();

        // When
        const now = performanceTimestampProvider.now();

        // Then
        expect(now).toBe(78343.570643);
        expect(performanceNowSpy).toHaveBeenCalledTimes(1);
    });

    test('should return different values when performance.now() changes', () => {
        // Given
        const performanceNowSpy = vi.spyOn(performance, 'now')
            .mockReturnValueOnce(78343.570643)
            .mockReturnValueOnce(78344.123456);
        const performanceTimestampProvider = new PerformanceTimestampProvider();

        // When
        const firstCall = performanceTimestampProvider.now();
        const secondCall = performanceTimestampProvider.now();

        // Then
        expect(firstCall).toBe(78343.570643);
        expect(secondCall).toBe(78344.123456);
        expect(performanceNowSpy).toHaveBeenCalledTimes(2);
    });
});
