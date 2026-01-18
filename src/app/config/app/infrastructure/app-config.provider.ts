import { type AssetsApiClient } from '@api/assets/infrastructure';
import { HttpUrl } from '@lib/http-client/domain';

import { AppConfig } from '../domain';

import { type AppConfigDto } from './app-config.dto';

const isAppConfigDto = (data: unknown): boolean => {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    return 'vaultApiUrl' in data && typeof data.vaultApiUrl === 'string';
};

export class AppConfigProvider {
    readonly #assetsApiClient: AssetsApiClient;

    public constructor(assetsApiClient: AssetsApiClient) {
        this.#assetsApiClient = assetsApiClient;
    }

    public async getConfig(): Promise<AppConfig> {
        const data = await this.#assetsApiClient.get<AppConfigDto>('/app-config.json');
        if (!isAppConfigDto(data)) {
            throw new Error('Invalid app config format');
        }
        return AppConfig.create({
            vaultApiUrl: HttpUrl.create(data.vaultApiUrl)
        });
    }
}
