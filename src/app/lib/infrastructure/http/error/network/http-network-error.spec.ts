import { HttpNetworkError } from './http-network-error';

describe(HttpNetworkError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpNetworkError({
            url: 'https://example.com/api',
            description: 'Network failure'
        });

        // Then
        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpNetworkError',
            url: 'https://example.com/api',
            description: 'Network failure',
            message: 'HTTP Network Error (URL: https://example.com/api): Network failure'
        }));
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new HttpNetworkError(
            {
                url: 'https://example.com/api',
                description: 'Network failure'
            },
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpNetworkError',
            url: 'https://example.com/api',
            description: 'Network failure',
            message: 'HTTP Network Error (URL: https://example.com/api): Network failure',
            cause
        }));
    });
});
