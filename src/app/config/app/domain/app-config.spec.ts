import { AppConfig } from './app-config';

describe(AppConfig, () => {
    test('should create AppConfig instance', () => {
        // Given, When
        const config = AppConfig.create({
            vaultApiUrl: 'https://api.example.com/vault'
        });

        // Then
        expect(config.vaultApiUrl.toString()).toBe('https://api.example.com/vault');
    });
});
