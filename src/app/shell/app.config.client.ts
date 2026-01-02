import { type ApplicationConfig, mergeApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideAssetsHttpClient, provideVaultHttpClient } from '@di/http-client/providers';
import { provideUserConfig } from '@di/user-config/providers';

import { sharedConfig } from './app.config.shared';

const browserOnlyConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideAssetsHttpClient(),
        provideVaultHttpClient(),
        provideUserConfig()
    ]
};

export const config: ApplicationConfig = mergeApplicationConfig(sharedConfig, browserOnlyConfig);
