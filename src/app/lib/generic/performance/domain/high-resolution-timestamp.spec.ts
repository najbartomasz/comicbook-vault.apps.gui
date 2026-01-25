import { HighResolutionTimestamp } from './high-resolution-timestamp';

describe(HighResolutionTimestamp, () => {
    test('should create timestamp from value', () => {
        // Given, When
        const timestamp = HighResolutionTimestamp.create(12345.6789);

        // Then
        expect(timestamp.value).toBe(12345.6789);
    });

    test('should calculate duration since another timestamp', () => {
        // Given
        const startTimestamp = HighResolutionTimestamp.create(1000.5);
        const endTimestamp = HighResolutionTimestamp.create(1100.75);

        // When
        const duration = endTimestamp.durationSince(startTimestamp);

        // Then
        expect(duration).toBe(100.25);
    });
});
