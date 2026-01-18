import { TestBed } from '@angular/core/testing';

import { VaultApiClient } from '@api/vault/infrastructure';
import { AppConfig } from '@config/app/domain';
import { HttpUrl } from 'src/app/lib/http-client/domain/http-url';

import { provideVaultApiClient } from './vault-api-client.provider';

describe(provideVaultApiClient, () => {
    test('should provide VaultApiClient', () => {
        // Given
        const appConfigStub = AppConfig.create({
            vaultApiUrl: HttpUrl.create('http://localhost:3000/vault')
        });
        TestBed.configureTestingModule({
            providers: [
                { provide: AppConfig, useValue: appConfigStub },
                provideVaultApiClient()
            ]
        });

        // When, Then
        expect(TestBed.inject(VaultApiClient)).toBeInstanceOf(VaultApiClient);
    });
});
