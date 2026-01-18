import {
    type ApplicationConfig,
    mergeApplicationConfig,
    provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideAppConfig, provideAssetsApiClient, provideVaultApiClient } from './app-providers';
import { sharedConfig } from './app.config.shared';

const browserOnlyConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideAssetsApiClient(),
        provideVaultApiClient(),
        provideAppConfig()
    ]
};

export const config: ApplicationConfig = mergeApplicationConfig(sharedConfig, browserOnlyConfig);
