import { DateTimeProvider } from './date-time-provider';

describe(DateTimeProvider, () => {
    test('should return timestamp from Date.now()', () => {
        // Given
        const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValueOnce(1735574400000);
        const dateTimeProvider = new DateTimeProvider();

        // When
        const result = dateTimeProvider.now();

        // Then
        expect(result).toBe(1735574400000);
        expect(dateNowSpy).toHaveBeenCalledTimes(1);
    });

    test('should return different values when Date.now() changes', () => {
        // Given
        const dateNowSpy = vi.spyOn(Date, 'now')
            .mockReturnValueOnce(1735574400000)
            .mockReturnValueOnce(1735574401000);
        const dateTimeProvider = new DateTimeProvider();

        // When
        const firstCall = dateTimeProvider.now();
        const secondCall = dateTimeProvider.now();

        // Then
        expect(firstCall).toBe(1735574400000);
        expect(secondCall).toBe(1735574401000);
        expect(dateNowSpy).toHaveBeenCalledTimes(2);
    });
});
