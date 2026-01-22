import { AppConfigError } from './app-config-error';

describe(AppConfigError, () => {
    test('should create an instance', () => {
        // Given, When
        const error = new AppConfigError('Invalid app config format', { invalid: 'data' });

        // Then
        expect(error).toBeInstanceOf(AppConfigError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'AppConfigError',
            invalidValue: { invalid: 'data' },
            message: 'Invalid app config format'
        }));
    });

    test('should create an instance with cause option', () => {
        // Given
        const cause = new Error('Original error');

        // When
        const error = new AppConfigError(
            'App config validation failed',
            { invalid: 'data' },
            { cause }
        );

        // Then
        expect(error).toBeInstanceOf(AppConfigError);
        expect(error).toStrictEqual(expect.objectContaining({
            name: 'AppConfigError',
            invalidValue: { invalid: 'data' },
            message: 'App config validation failed',
            cause
        }));
    });
});
