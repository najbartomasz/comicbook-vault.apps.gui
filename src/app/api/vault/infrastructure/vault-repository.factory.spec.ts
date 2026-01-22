import { HttpVaultRepository } from './http-vault-repository';
import { createVaultRepository } from './vault-repository.factory';

describe(createVaultRepository, () => {
    test('should create HttpVaultRepository instance', () => {
        // Given, When
        const vaultApiClient = createVaultRepository('https://api.example.com/vault');

        // Then
        expect(vaultApiClient).toBeInstanceOf(HttpVaultRepository);
    });
});
