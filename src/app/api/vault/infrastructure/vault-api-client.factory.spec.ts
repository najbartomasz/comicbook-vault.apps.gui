import { VaultApiClient } from './vault-api-client';
import { createVaultApiClient } from './vault-api-client.factory';

describe(createVaultApiClient, () => {
    test('should create VaultApiClient instance', () => {
        // Given, When
        const vaultApiClient = createVaultApiClient('https://api.example.com/vault');

        // Then
        expect(vaultApiClient).toBeInstanceOf(VaultApiClient);
    });
});
