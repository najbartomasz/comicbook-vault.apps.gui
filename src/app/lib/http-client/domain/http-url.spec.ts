import { HttpUrl } from './http-url';

describe(HttpUrl, () => {
    test('should create HttpUrl for valid http URL', () => {
        // Given, When
        const result = HttpUrl.create('http://example.com');

        // Then
        expect(result.toString()).toBe('http://example.com');
    });

    test('should create HttpUrl for valid https URL', () => {
        // Given, When
        const result = HttpUrl.create('https://example.com');

        // Then
        expect(result.toString()).toBe('https://example.com');
    });

    test('should throw error for invalid URL', () => {
        // Given
        const url = 'ftp://example.com';

        // When / Then
        expect(() => HttpUrl.create(url)).toThrowError(`Invalid URL: ${url}. URL must start with 'http://' or 'https://'.`);
    });

    test('should throw error for URL without protocol', () => {
        // Given
        const url = 'example.com';

        // When / Then
        expect(() => HttpUrl.create(url)).toThrowError(`Invalid URL: ${url}. URL must start with 'http://' or 'https://'.`);
    });

    test('should throw error for empty URL', () => {
        // Given
        const url = '';

        // When, Then
        expect(() => HttpUrl.create(url)).toThrowError(`Invalid URL: ${url}. URL must start with 'http://' or 'https://'.`);
    });
});
