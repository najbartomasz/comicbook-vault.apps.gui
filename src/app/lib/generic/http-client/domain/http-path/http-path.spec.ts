import { HttpPath } from './http-path';
import { HttpPathError } from './http-path-error';

describe(HttpPath, () => {
    test('should create HttpPath instance from string', () => {
        // Given
        const pathString = '/api/v1/resources';

        // When
        const httpPath = HttpPath.create(pathString);

        // Then
        expect(httpPath).toBeInstanceOf(HttpPath);
        expect(httpPath.toString()).toBe(pathString);
    });

    test('should throw error for path not starting with "/"', () => {
        // Given, When, Then
        expect(() => HttpPath.create('api/v1/resources')).toThrowError(new HttpPathError(
            "Invalid HTTP path: must start with '/' but got 'api/v1/resources'",
            'api/v1/resources'
        ));
    });

    test('should throw error for path containing double slashes', () => {
        // Given, When, Then
        expect(() => HttpPath.create('/api//v1/resources')).toThrowError(new HttpPathError(
            "Invalid HTTP path: contains double slashes '/api//v1/resources'",
            '/api//v1/resources'
        ));
    });

    test('should throw error for path ending with "/"', () => {
        // Given, When, Then
        expect(() => HttpPath.create('/api/v1/resources/')).toThrowError(new HttpPathError(
            "Invalid HTTP path: must not end with '/' but got '/api/v1/resources/'",
            '/api/v1/resources/'
        ));
    });
});
