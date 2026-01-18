import { HttpUrl } from '@lib/http-client/domain';

import { AppConfig } from './app-config';

describe(AppConfig, () => {
    test('should create AppConfig instance', () => {
        // Given
        const vaultApiUrl = 'https://api.example.com/vault';

        // When
        const config = AppConfig.create({
            vaultApiUrl: HttpUrl.create(vaultApiUrl)
        });

        // Then
        expect(config.vaultApiUrl.toString()).toBe(vaultApiUrl);
    });
});
