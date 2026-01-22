import { TestBed } from '@angular/core/testing';

import { VaultRepository } from '@api/vault/domain';
import { AppConfig } from '@config/app/domain';

import { provideVaultApiClient } from './vault-repository.provider';

describe(provideVaultApiClient, () => {
    test('should provide VaultRepository', () => {
        // Given
        const appConfigStub = AppConfig.create({
            vaultApiUrl: 'http://localhost:3000/vault'
        });
        TestBed.configureTestingModule({
            providers: [
                { provide: AppConfig, useValue: appConfigStub },
                ...provideVaultApiClient()
            ]
        });

        // When, Then
        expect(TestBed.inject(VaultRepository)).toBeInstanceOf(VaultRepository);
    });
});
