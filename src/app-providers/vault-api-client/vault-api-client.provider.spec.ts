import { TestBed } from '@angular/core/testing';

import { AppConfig } from '@lib/supporting/app-config/domain';
import { VaultApiClient } from '@lib/supporting/vault-api-client/domain';

import { provideVaultApiClient } from './vault-api-client.provider';

describe(provideVaultApiClient, () => {
    test('should provide VaultApiClient', () => {
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
        expect(TestBed.inject(VaultApiClient)).toBeInstanceOf(VaultApiClient);
    });
});
