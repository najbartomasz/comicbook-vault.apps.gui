import { type HttpClient } from '@lib/http-client/domain';

import { VaultRepository } from '../domain';

export class HttpVaultRepository extends VaultRepository {
    readonly #httpClient: HttpClient;

    public constructor(httpClient: HttpClient) {
        super();
        this.#httpClient = httpClient;
    }

    public async get<T>(path: `/${string}`, options?: { abortSignal?: AbortSignal }): Promise<T> {
        const response = await this.#httpClient.get(path, options);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        return response.body as T;
    }
}
