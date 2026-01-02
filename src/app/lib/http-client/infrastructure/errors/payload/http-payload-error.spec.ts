import { HttpPayloadError } from './http-payload-error';

describe(HttpPayloadError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpPayloadError({
            url: 'https://example.com/api'
        });

        // Then
        expect(error).toBeInstanceOf(HttpPayloadError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpPayloadError',
            url: 'https://example.com/api',
            description: 'Failed to parse response',
            message: 'HTTP Payload Error (URL: https://example.com/api)'
        }));
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new HttpPayloadError(
            { url: 'https://example.com/api' },
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(HttpPayloadError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpPayloadError',
            url: 'https://example.com/api',
            description: 'Failed to parse response',
            message: 'HTTP Payload Error (URL: https://example.com/api)',
            cause
        }));
    });
});
