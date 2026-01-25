import { EndpointPath } from '@lib/generic/endpoint/domain';
import { type AssetsApiClient } from '@lib/supporting/assets-api-client/domain';

import { AppConfig, AppConfigError } from '../domain';

import { type AppConfigDto } from './app-config.dto';

const isAppConfigDto = (data: unknown): data is AppConfigDto => {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    return 'vaultApiUrl' in data && typeof data.vaultApiUrl === 'string';
};

export class AppConfigLoader {
    readonly #assetsApiClient: AssetsApiClient;

    public constructor(assetsApiClient: AssetsApiClient) {
        this.#assetsApiClient = assetsApiClient;
    }

    public async load(): Promise<AppConfig> {
        const data = await this.#assetsApiClient.get<AppConfigDto>(EndpointPath.create('/app-config.json'));
        if (!isAppConfigDto(data)) {
            throw new AppConfigError('Invalid app config format', data);
        }
        return AppConfig.create({
            vaultApiUrl: data.vaultApiUrl
        });
    }
}
