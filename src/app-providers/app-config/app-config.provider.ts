import { type EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { AppConfigLoader } from '@lib/supporting/app-config/application';
import { AppConfig } from '@lib/supporting/app-config/domain';
import { AssetsRepository } from '@lib/supporting/assets-api-client/domain';

export const provideAppConfig = (): EnvironmentProviders => {
    let appConfig: AppConfig | undefined;
    return makeEnvironmentProviders([
        provideAppInitializer(async () => {
            const appConfigLoader = new AppConfigLoader(inject(AssetsRepository));
            appConfig = await appConfigLoader.load();
        }),
        {
            provide: AppConfig,
            useFactory: () => {
                if (!appConfig) {
                    throw new Error(
                        'AppConfig is not initialized. Ensure the app initializer has completed before injecting AppConfig.'
                    );
                }
                return appConfig;
            }
        }
    ]);
};
