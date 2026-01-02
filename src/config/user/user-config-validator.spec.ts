import { isUserConfigValid } from './user-config-validator';

describe(isUserConfigValid, () => {
    test('should return true for valid config', () => {
        // Given
        const validConfig = {
            vaultApiUrl: 'https://example.com/vault'
        };

        // When, Then
        expect(isUserConfigValid(validConfig)).toBe(true);
    });

    test('should return false for non-object value', () => {
        // Given
        const invalidConfig = 'not-an-object';

        // When, Then
        expect(isUserConfigValid(invalidConfig)).toBe(false);
    });

    test('should return false for null value', () => {
        // Given
        const invalidConfig = null;

        // When, Then
        expect(isUserConfigValid(invalidConfig)).toBe(false);
    });

    test('should return false for invalid config structure', () => {
        // Given
        const invalidConfig = {
            someOtherKey: 'value'
        };

        // When, Then
        expect(isUserConfigValid(invalidConfig)).toBe(false);
    });

    test('should return flase for invalid vaultApiUrl type', () => {
        // Given
        const invalidConfig = {
            vaultApiUrl: 12345
        };

        // When, Then
        expect(isUserConfigValid(invalidConfig)).toBe(false);
    });

    test('should return false for invalid vaultApiUrl', () => {
        // Given
        const invalidConfig = {
            vaultApiUrl: 'sftp://invalid-url.com'
        };

        // When, Then
        expect(isUserConfigValid(invalidConfig)).toBe(false);
    });
});
