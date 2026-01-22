import { TestBed } from '@angular/core/testing';

import { VaultRepository } from '@api/vault/domain';
import { AppConfig } from '@config/app/domain';
import { HttpUrl } from 'src/app/lib/http-client/domain/http-url';

import { provideVaultApiClient } from './vault-repository.provider';

describe(provideVaultApiClient, () => {
    test('should provide VaultRepository', () => {
        // Given
        const appConfigStub = AppConfig.create({
            vaultApiUrl: HttpUrl.create('http://localhost:3000/vault')
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
