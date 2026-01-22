import { type AssetsRepository } from '@api/assets/domain';

import { AppConfig } from '../domain';

import { type AppConfigDto } from './app-config.dto';

const isAppConfigDto = (data: unknown): data is AppConfigDto => {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    return 'vaultApiUrl' in data && typeof data.vaultApiUrl === 'string';
};

export class AppConfigLoader {
    readonly #assetsRepository: AssetsRepository;

    public constructor(assetsRepository: AssetsRepository) {
        this.#assetsRepository = assetsRepository;
    }

    public async load(): Promise<AppConfig> {
        const data = await this.#assetsRepository.get<AppConfigDto>('/app-config.json');
        if (!isAppConfigDto(data)) {
            throw new Error('Invalid app config format');
        }
        return AppConfig.create({
            vaultApiUrl: data.vaultApiUrl
        });
    }
}
