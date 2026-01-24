import { HttpUrl } from '@lib/generic/http-client/domain';

interface AppConfigData {
    vaultApiUrl: string;
}

export class AppConfig {
    public get vaultApiUrl(): HttpUrl {
        return this.#vaultApiUrl;
    }

    readonly #vaultApiUrl: HttpUrl;

    private constructor(config: AppConfigData) {
        this.#vaultApiUrl = HttpUrl.create(config.vaultApiUrl);
    }

    public static create(config: AppConfigData): AppConfig {
        return new AppConfig(config);
    }
}
