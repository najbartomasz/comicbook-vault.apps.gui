import { type EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { AssetsRepository } from '@api/assets/domain';
import { AppConfig } from '@config/app/domain';
import { AppConfigProvider } from '@config/app/infrastructure';

class AppConfigStore {
    #config?: AppConfig;

    public setConfig(appConfig: AppConfig): void {
        this.#config = appConfig;
    }

    public getConfig(): AppConfig | undefined {
        return this.#config;
    }
}

export const provideAppConfig = (): EnvironmentProviders => (
    makeEnvironmentProviders([
        AppConfigStore,
        provideAppInitializer(async () => {
            const appConfigProvider = new AppConfigProvider(inject(AssetsRepository));
            const appConfigStore = inject(AppConfigStore);
            const appConfig = await appConfigProvider.getConfig();
            appConfigStore.setConfig(appConfig);
        }),
        {
            provide: AppConfig,
            useFactory: () => {
                const appConfig = inject(AppConfigStore).getConfig();
                if (!appConfig) {
                    throw new Error(
                        'AppConfig is not initialized. Ensure the app initializer has completed before injecting AppConfig.'
                    );
                }
                return appConfig;
            }
        }
    ])
);
