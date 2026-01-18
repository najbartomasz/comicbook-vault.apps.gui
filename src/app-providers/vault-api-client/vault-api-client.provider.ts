import { type Provider } from '@angular/core';

import { createVaultApiClient, VaultApiClient } from '@api/vault/infrastructure';
import { AppConfig } from '@config/app/domain';

export const provideVaultApiClient = (): Provider => ({
    provide: VaultApiClient,
    useFactory: (appConfig: AppConfig) => createVaultApiClient(appConfig.vaultApiUrl.toString()),
    deps: [AppConfig]
});
