import { HttpVaultApiClient } from './http-vault-api-client';
import { createVaultApiClient } from './vault-api-client.factory';

describe(createVaultApiClient, () => {
    test('should create HttpVaultApiClient instance', () => {
        // Given, When
        const vaultApiClient = createVaultApiClient('https://api.example.com/vault');

        // Then
        expect(vaultApiClient).toBeInstanceOf(HttpVaultApiClient);
    });
});
