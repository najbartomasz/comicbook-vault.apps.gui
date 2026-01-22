import { HttpPathError } from './http-path-error';

describe(HttpPathError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new HttpPathError('Invalid HTTP path: must start with \'/\'', 'api/users');

        // Then
        expect(error).toBeInstanceOf(HttpPathError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpPathError',
            invalidValue: 'api/users',
            message: 'Invalid HTTP path: must start with \'/\''
        }));
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new HttpPathError(
            'HTTP path validation failed',
            '/invalid//path',
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(HttpPathError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'HttpPathError',
            invalidValue: '/invalid//path',
            message: 'HTTP path validation failed',
            cause
        }));
    });
});
