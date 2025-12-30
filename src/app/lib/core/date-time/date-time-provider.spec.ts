import { DateTimeProvider } from './date-time-provider';

describe(DateTimeProvider, () => {
    test('should return timestamp from Date.now()', () => {
        // Given
        const mockTimestamp = 1735574400000;
        const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValueOnce(mockTimestamp);
        const dateTimeProvider = new DateTimeProvider();

        // When
        const result = dateTimeProvider.now();

        // Then
        expect(result).toStrictEqual(mockTimestamp);
        expect(dateNowSpy).toHaveBeenCalledTimes(1);
    });

    test('should return different values when Date.now() changes', () => {
        // Given
        const firstTimestamp = 1735574400000;
        const secondTimestamp = 1735574401000;
        const dateNowSpy = vi.spyOn(Date, 'now')
            .mockReturnValueOnce(firstTimestamp)
            .mockReturnValueOnce(secondTimestamp);
        const dateTimeProvider = new DateTimeProvider();

        // When
        const firstCall = dateTimeProvider.now();
        const secondCall = dateTimeProvider.now();

        // Then
        expect(firstCall).toStrictEqual(firstTimestamp);
        expect(secondCall).toStrictEqual(secondTimestamp);
        expect(dateNowSpy).toHaveBeenCalledTimes(2);
    });
});
