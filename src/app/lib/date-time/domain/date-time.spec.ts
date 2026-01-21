import { DateTime } from './date-time';

describe(DateTime, () => {
    test('should create DateTime with current Date.now() value', () => {
        // Given
        const dateNowMock = vi.spyOn(Date, 'now').mockReturnValueOnce(1735574400000);

        // When
        const dateTime = DateTime.now();

        // Then
        expect(dateTime).toBeInstanceOf(DateTime);
        expect(dateTime.timestamp).toBe(1735574400000);
        expect(dateNowMock).toHaveBeenCalledTimes(1);
    });

    test('should convert to ISO string', () => {
        // Given
        vi.spyOn(Date, 'now').mockReturnValueOnce(1735574400000);
        const dateTime = DateTime.now();

        // When
        const isoString = dateTime.toIsoString();

        // Then
        expect(isoString).toBe('2024-12-30T16:00:00.000Z');
    });
});
