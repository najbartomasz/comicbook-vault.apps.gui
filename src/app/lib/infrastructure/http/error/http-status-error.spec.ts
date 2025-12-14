import { describe, expect, test } from '@testing/unit';

import { HttpStatusError } from './http-status-error';

describe(HttpStatusError, () => {
    test('should create an instance with body', () => {
        // Given, When
        const body = { message: 'Resource not found' };
        const error = new HttpStatusError({
            status: 404,
            statusText: 'Not Found',
            url: 'http://example.com/resource',
            body
        });

        // Then
        expect(error).toBeInstanceOf(HttpStatusError);
        expect(error.name).toBe('HttpStatusError');
        expect(error.url).toBe('http://example.com/resource');
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.body).toStrictEqual({ message: 'Resource not found' });
        expect(error.body).not.toBe(body);
        expect(error.message).toBe('HTTP Status Error 404: Not Found (URL: http://example.com/resource)');
    });

    test('should create an instance without body', () => {
        // Given, When
        const error = new HttpStatusError({
            status: 500,
            statusText: 'Internal Server Error',
            url: 'http://example.com/resource'
        });

        // Then
        expect(error).toBeInstanceOf(HttpStatusError);
        expect(error.name).toBe('HttpStatusError');
        expect(error.url).toBe('http://example.com/resource');
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
        expect(error.body).toBeUndefined();
        expect(error.message).toBe('HTTP Status Error 500: Internal Server Error (URL: http://example.com/resource)');
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new HttpStatusError(
            {
                status: 404,
                statusText: 'Not Found',
                url: 'http://example.com/resource'
            },
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(HttpStatusError);
        expect(error.name).toBe('HttpStatusError');
        expect(error.url).toBe('http://example.com/resource');
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.message).toBe('HTTP Status Error 404: Not Found (URL: http://example.com/resource)');
        expect(error.cause).toBe(cause);
    });
});
