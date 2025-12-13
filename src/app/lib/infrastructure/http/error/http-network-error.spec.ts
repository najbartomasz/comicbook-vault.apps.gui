import { describe, expect, test } from '@testing/unit';

import { HttpNetworkError } from './http-network-error';

describe(HttpNetworkError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpNetworkError({
            url: 'http://example.com/resource',
            description: 'Network failure'
        });

        // Then
        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error.name).toBe('HttpNetworkError');
        expect(error.url).toBe('http://example.com/resource');
        expect(error.description).toBe('Network failure');
        expect(error.message).toBe('HTTP Network Error (URL: http://example.com/resource): Network failure');
    });
});
