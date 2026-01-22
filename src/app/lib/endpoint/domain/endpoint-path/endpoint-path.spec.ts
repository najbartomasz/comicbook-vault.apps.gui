import { EndpointPath } from './endpoint-path';
import { EndpointPathError } from './endpoint-path-error';

describe('_EndpointPath', () => {
    test('should create instance from root path', () => {
        // Given, When
        const path = EndpointPath.create('/');

        // Then
        expect(path).toBeInstanceOf(EndpointPath);
        expect(path.toString()).toBe('/');
    });

    test('should create instance from nested path', () => {
        // Given, When
        const path = EndpointPath.create('/api/v1/users/123/profile');

        // Then
        expect(path).toBeInstanceOf(EndpointPath);
        expect(path.toString()).toBe('/api/v1/users/123/profile');
    });

    test('should throw error for empty string', () => {
        // Given, When, Then
        expect(() => EndpointPath.create('')).toThrowError(new EndpointPathError('Endpoint path cannot be empty', ''));
    });

    test('should throw error for whitespace-only string', () => {
        // Given, When, Then
        expect(() => EndpointPath.create('   ')).toThrowError(new EndpointPathError('Endpoint path cannot be empty', '   '));
    });

    test('should throw error for path not starting with slash', () => {
        // Given, When, Then
        expect(() => EndpointPath.create('api/users')).toThrowError(new EndpointPathError(
            "Invalid endpoint path: must start with '/' but got 'api/users'",
            'api/users'
        ));
    });

    test('should throw error for path starting with protocol', () => {
        // Given, When, Then
        expect(() => EndpointPath.create('http://example.com/api')).toThrowError(new EndpointPathError(
            "Invalid endpoint path: must start with '/' but got 'http://example.com/api'",
            'http://example.com/api'
        ));
    });
});
