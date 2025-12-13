import { describe, expect, test } from '@testing/unit';

import { HttpPayloadError } from './http-payload-error';

describe(HttpPayloadError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpPayloadError({
            url: 'http://example.com/resource'
        });

        // Then
        expect(error).toBeInstanceOf(HttpPayloadError);
        expect(error.name).toBe('HttpPayloadError');
        expect(error.url).toBe('http://example.com/resource');
        expect(error.description).toBe('Failed to parse response as JSON');
        expect(error.message).toBe('HTTP Payload Error (URL: http://example.com/resource)');
    });
});
