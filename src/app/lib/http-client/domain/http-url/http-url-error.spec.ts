import { HttpUrlError } from './http-url-error';

describe(HttpUrlError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpUrlError('Invalid URL: must start with http:// or https://', 'ftp://example.com');

        // Then
        expect(error).toBeInstanceOf(HttpUrlError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpUrlError',
            invalidValue: 'ftp://example.com',
            message: 'Invalid URL: must start with http:// or https://'
        }));
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new HttpUrlError(
            'URL validation failed',
            'invalid-url',
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(HttpUrlError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpUrlError',
            invalidValue: 'invalid-url',
            message: 'URL validation failed',
            cause
        }));
    });
});
