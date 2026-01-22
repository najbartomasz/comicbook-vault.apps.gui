import { type AssetsRepository } from '@api/assets/domain';
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
    readonly #assetsRepository: AssetsRepository;

    public constructor(assetsRepository: AssetsRepository) {
        this.#assetsRepository = assetsRepository;
    }

    public async getConfig(): Promise<AppConfig> {
        const data = await this.#assetsRepository.get<AppConfigDto>('/app-config.json');
        if (!isAppConfigDto(data)) {
            throw new Error('Invalid app config format');
        }
        return AppConfig.create({
            vaultApiUrl: HttpUrl.create(data.vaultApiUrl)
        });
    }
}
