import { DateTime } from './date-time';

describe(DateTime, () => {
    test('should create DateTime from timestamp', () => {
        // Given, When
        const dateTime = DateTime.create(1735574400000);

        // Then
        expect(dateTime).toBeInstanceOf(DateTime);
        expect(dateTime.timestamp).toBe(1735574400000);
    });

    test('should convert to ISO string', () => {
        // Given
        const dateTime = DateTime.create(1735574400000);

        // When
        const isoString = dateTime.toIsoString();

        // Then
        expect(isoString).toBe('2024-12-30T16:00:00.000Z');
    });
});
