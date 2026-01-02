import { HttpStatus, type HttpClient } from '@lib/http-client/domain';

import { type AssetLoader } from '../domain';

export class HttpAssetLoader implements AssetLoader {
    readonly #httpClient: HttpClient;

    public constructor(httpClient: HttpClient) {
        this.#httpClient = httpClient;
    }

    public async load<T>(path: string, validator: (data: unknown) => T): Promise<T> {
        const response = await this.#httpClient.get(path);
        if (response.status !== HttpStatus.OK) {
            throw new Error(`Failed to load asset from ${path}: ${response.statusText}`);
        }

        return validator(response.body);
    }
}
