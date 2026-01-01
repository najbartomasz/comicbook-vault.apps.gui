/* eslint-disable vitest/max-expects */
import { HttpPayloadError } from './http-payload-error';

describe(HttpPayloadError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpPayloadError({
            url: 'http://example.com/api'
        });

        // Then
        expect(error).toBeInstanceOf(HttpPayloadError);
        expect(error.name).toBe('HttpPayloadError');
        expect(error.url).toBe('http://example.com/api');
        expect(error.description).toBe('Failed to parse response as JSON');
        expect(error.message).toBe('HTTP Payload Error (URL: http://example.com/api)');
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new HttpPayloadError(
            { url: 'http://example.com/api' },
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(HttpPayloadError);
        expect(error.name).toBe('HttpPayloadError');
        expect(error.url).toBe('http://example.com/api');
        expect(error.description).toBe('Failed to parse response as JSON');
        expect(error.message).toBe('HTTP Payload Error (URL: http://example.com/api)');
        expect(error.cause).toBe(cause);
    });
});
