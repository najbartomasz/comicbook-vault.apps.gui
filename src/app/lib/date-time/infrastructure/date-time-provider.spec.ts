import { DateTimeProvider } from './date-time-provider';

describe(DateTimeProvider, () => {
    test('should return timestamp from Date.now()', () => {
        // Given
        const dateNowMock = vi.spyOn(Date, 'now').mockReturnValueOnce(1735574400000);
        const dateTimeProvider = new DateTimeProvider();

        // When
        const now = dateTimeProvider.now();

        // Then
        expect(now).toBe(1735574400000);
        expect(dateNowMock).toHaveBeenCalledTimes(1);
    });

    test('should return different values when Date.now() changes', () => {
        // Given
        const dateNowMock = vi.spyOn(Date, 'now')
            .mockReturnValueOnce(1735574400000)
            .mockReturnValueOnce(1735574401000);
        const dateTimeProvider = new DateTimeProvider();

        // When
        const firstCall = dateTimeProvider.now();
        const secondCall = dateTimeProvider.now();

        // Then
        expect(firstCall).toBe(1735574400000);
        expect(secondCall).toBe(1735574401000);
        expect(dateNowMock).toHaveBeenCalledTimes(2);
    });
});
