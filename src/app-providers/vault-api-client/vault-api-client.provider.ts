import { type Provider } from '@angular/core';

import { AppConfig } from '@lib/supporting/app-config/domain';
import { VaultApiClient } from '@lib/supporting/vault-api-client/domain';
import { createVaultApiClient } from '@lib/supporting/vault-api-client/infrastructure';

export const provideVaultApiClient = (): Provider[] => [
    {
        provide: VaultApiClient,
        useFactory: (appConfig: AppConfig) => createVaultApiClient(appConfig.vaultApiUrl.toString()),
        deps: [AppConfig]
    }
];
