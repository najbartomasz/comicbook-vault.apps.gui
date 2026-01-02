import { type EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { type UserConfig, UserConfigLoader } from '@config/user';
import { HttpAssetLoader } from '@lib/asset-loader/infrastructure';

import { injectAssetsHttpClient } from '../../http-client/inject-functions';
import { USER_CONFIG_TOKEN } from '../injection-tokens';

class UserConfigStore {
    #config?: UserConfig;

    public setConfig(userConfig: UserConfig): void {
        this.#config = userConfig;
    }

    public getConfig(): UserConfig | undefined {
        return this.#config;
    }
}

export const provideUserConfig = (): EnvironmentProviders => {
    return makeEnvironmentProviders([
        UserConfigStore,
        provideAppInitializer(async () => {
            const userConfigLoader = new UserConfigLoader(new HttpAssetLoader(injectAssetsHttpClient()));
            const userConfigStore = inject(UserConfigStore);
            const userConfig = await userConfigLoader.load();
            userConfigStore.setConfig(userConfig);
        }),
        {
            provide: USER_CONFIG_TOKEN,
            useFactory: () => {
                const userConfig = inject(UserConfigStore).getConfig();
                if (!userConfig) {
                    throw new Error(
                        'USER_CONFIG_TOKEN is not initialized. Ensure the app initializer has completed before injecting USER_CONFIG_TOKEN.'
                    );
                }
                return userConfig;
            }
        }
    ]);
};
