import { HttpAbortError } from './http-abort-error';

describe(HttpAbortError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpAbortError({
            url: 'http://example.com/api'
        });

        // Then
        expect(error).toBeInstanceOf(HttpAbortError);
        expect(error.name).toBe('HttpAbortError');
        expect(error.url).toBe('http://example.com/api');
        expect(error.message).toBe('HTTP Request Aborted (URL: http://example.com/api)');
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new HttpAbortError(
            { url: 'http://example.com/api' },
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(HttpAbortError);
        expect(error.name).toBe('HttpAbortError');
        expect(error.url).toBe('http://example.com/api');
        expect(error.message).toBe('HTTP Request Aborted (URL: http://example.com/api)');
        expect(error.cause).toBe(cause);
    });
});
