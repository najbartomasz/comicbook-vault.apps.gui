import { type AssetLoader } from '@lib/asset-loader/domain';
import { HttpUrl } from '@lib/http-client/domain';

import { isUserConfigValid } from './user-config-validator';
import { type UserConfig } from './user-config.interface';

export class UserConfigLoader {
    readonly #assetLoader: AssetLoader;

    public constructor(assetLoader: AssetLoader) {
        this.#assetLoader = assetLoader;
    }

    public async load(): Promise<UserConfig> {
        return this.#assetLoader.load<UserConfig>('/user-config.json', (data) => {
            if (!isUserConfigValid(data)) {
                throw new Error('Invalid user config structure');
            }
            return {
                vaultApiUrl: HttpUrl.create(data.vaultApiUrl)
            };
        });
    }
}

