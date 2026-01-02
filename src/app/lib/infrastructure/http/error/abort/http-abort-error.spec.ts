import { HttpAbortError } from './http-abort-error';

describe(HttpAbortError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpAbortError({
            url: 'https://example.com/api'
        });

        // Then
        expect(error).toBeInstanceOf(HttpAbortError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpAbortError',
            url: 'https://example.com/api',
            message: 'HTTP Request Aborted (URL: https://example.com/api)'
        }));
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new HttpAbortError(
            { url: 'https://example.com/api' },
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(HttpAbortError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpAbortError',
            url: 'https://example.com/api',
            message: 'HTTP Request Aborted (URL: https://example.com/api)',
            cause
        }));
    });
});
