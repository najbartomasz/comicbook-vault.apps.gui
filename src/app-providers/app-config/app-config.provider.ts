import { type EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { AssetsRepository } from '@api/assets/domain';
import { AppConfigLoader } from '@config/app/application';
import { AppConfig } from '@config/app/domain';

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
