import { type HttpUrl } from '@lib/http-client/domain';

export interface UserConfig {
    readonly vaultApiUrl: HttpUrl;
}
