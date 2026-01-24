import { HttpUrl } from './http-url';
import { HttpUrlError } from './http-url-error';

describe(HttpUrl, () => {
    test('should create HttpUrl for valid http URL', () => {
        // Given, When
        const httpUrl = HttpUrl.create('http://example.com');

        // Then
        expect(httpUrl.toString()).toBe('http://example.com/');
    });

    test('should create HttpUrl for valid https URL', () => {
        // Given, When
        const httpUrl = HttpUrl.create('https://example.com');

        // Then
        expect(httpUrl.toString()).toBe('https://example.com/');
    });

    test('should throw error for invalid URL', () => {
        // Given, When, Then
        expect(() => HttpUrl.create('invalid-url')).toThrowError(new HttpUrlError(
            'Invalid URL: "invalid-url".',
            'invalid-url'
        ));
    });

    test('should throw error for invalid protocol', () => {
        // Given, When, Then
        expect(() => HttpUrl.create('ftp://example.com')).toThrowError(new HttpUrlError(
            'Invalid URL: "ftp://example.com". URL must start with \'http://\' or \'https://\'.',
            'ftp://example.com'
        ));
    });

    test('should throw error for empty URL', () => {
        // Given, When, Then
        expect(() => HttpUrl.create('')).toThrowError(new HttpUrlError(
            'Invalid URL: "".',
            ''
        ));
    });
});
