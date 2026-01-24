import { EndpointPathError } from './endpoint-path-error';

describe(EndpointPathError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new EndpointPathError('Endpoint path cannot be empty', '');

        // Then
        expect(error).toBeInstanceOf(EndpointPathError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'EndpointPathError',
            invalidValue: '',
            message: 'Endpoint path cannot be empty'
        }));
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new EndpointPathError(
            'Endpoint path validation failed',
            'invalid-path',
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(EndpointPathError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'EndpointPathError',
            invalidValue: 'invalid-path',
            message: 'Endpoint path validation failed',
            cause
        }));
    });
});
