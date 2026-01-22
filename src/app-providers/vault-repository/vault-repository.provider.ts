import { type Provider } from '@angular/core';

import { VaultRepository } from '@api/vault/domain';
import { createVaultRepository } from '@api/vault/infrastructure';
import { AppConfig } from '@config/app/domain';

export const provideVaultApiClient = (): Provider[] => [
    {
        provide: VaultRepository,
        useFactory: (appConfig: AppConfig) => createVaultRepository(appConfig.vaultApiUrl.toString()),
        deps: [AppConfig]
    }
];
