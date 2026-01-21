import { HighResolutionTimestamp } from './high-resolution-timestamp';

describe(HighResolutionTimestamp, () => {
    test('should create timestamp with current performance.now() value', () => {
        // Given
        const performanceNowSpy = vi.spyOn(performance, 'now').mockReturnValueOnce(12345.6789);

        // When
        const timestamp = HighResolutionTimestamp.now();

        // Then
        expect(timestamp.value).toBe(12345.6789);
        expect(performanceNowSpy).toHaveBeenCalledTimes(1);
    });

    test('should calculate duration since another timestamp', () => {
        // Given
        vi.spyOn(performance, 'now')
            .mockReturnValueOnce(1000.5)
            .mockReturnValueOnce(1100.75);
        const startTimestamp = HighResolutionTimestamp.now();
        const endTimestamp = HighResolutionTimestamp.now();

        // When
        const duration = endTimestamp.durationSince(startTimestamp);

        // Then
        expect(duration).toBe(100.25);
    });
});
