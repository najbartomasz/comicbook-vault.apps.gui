import { describe, expect, test } from '@testing/unit';

import { HttpAbortError } from './http-abort-error';

describe(HttpAbortError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpAbortError({
            url: 'http://example.com/resource'
        });

        // Then
        expect(error).toBeInstanceOf(HttpAbortError);
        expect(error.name).toBe('HttpAbortError');
        expect(error.url).toBe('http://example.com/resource');
        expect(error.message).toBe('HTTP Request Aborted (URL: http://example.com/resource)');
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new HttpAbortError(
            { url: 'http://example.com/resource' },
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(HttpAbortError);
        expect(error.name).toBe('HttpAbortError');
        expect(error.url).toBe('http://example.com/resource');
        expect(error.message).toBe('HTTP Request Aborted (URL: http://example.com/resource)');
        expect(error.cause).toBe(cause);
    });
});
