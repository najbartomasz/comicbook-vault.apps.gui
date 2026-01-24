import { type Provider } from '@angular/core';

import { AppConfig } from '@lib/supporting/app-config/domain';
import { VaultRepository } from '@lib/supporting/vault-api-client/domain';
import { createVaultRepository } from '@lib/supporting/vault-api-client/infrastructure';

export const provideVaultApiClient = (): Provider[] => [
    {
        provide: VaultRepository,
        useFactory: (appConfig: AppConfig) => createVaultRepository(appConfig.vaultApiUrl.toString()),
        deps: [AppConfig]
    }
];
