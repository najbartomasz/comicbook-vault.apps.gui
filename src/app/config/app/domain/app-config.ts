import { type HttpUrl } from '@lib/http-client/domain';

interface AppConfigData {
    vaultApiUrl: HttpUrl;
}

export class AppConfig {
    public get vaultApiUrl(): HttpUrl {
        return this.#vaultApiUrl;
    }

    readonly #vaultApiUrl: HttpUrl;

    private constructor(config: AppConfigData) {
        this.#vaultApiUrl = config.vaultApiUrl;
    }

    public static create(config: AppConfigData): AppConfig {
        return new AppConfig(config);
    }
}
