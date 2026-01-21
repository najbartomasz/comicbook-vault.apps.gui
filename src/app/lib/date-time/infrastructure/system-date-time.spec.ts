import { SystemDateTime } from './system-date-time';

describe(SystemDateTime, () => {
    test('should return DateTime from current time', () => {
        // Given
        const dateNowMock = vi.spyOn(Date, 'now').mockReturnValueOnce(1735574400000);
        const systemDateTime = new SystemDateTime();

        // When
        const dateTime = systemDateTime.now();

        // Then
        expect(dateTime.toIsoString()).toBe('2024-12-30T16:00:00.000Z');
        expect(dateNowMock).toHaveBeenCalledTimes(1);
    });

    test('should return different DateTime instances when called multiple times', () => {
        // Given
        const dateNowMock = vi.spyOn(Date, 'now')
            .mockReturnValueOnce(1735574400000)
            .mockReturnValueOnce(1735574401000);
        const systemDateTime = new SystemDateTime();

        // When
        const firstCall = systemDateTime.now();
        const secondCall = systemDateTime.now();

        // Then
        expect(firstCall.timestamp).toBe(1735574400000);
        expect(secondCall.timestamp).toBe(1735574401000);
        expect(dateNowMock).toHaveBeenCalledTimes(2);
    });
});
