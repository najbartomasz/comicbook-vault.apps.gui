import { type EndpointPath } from '@lib/generic/endpoint/domain';
import { type HttpClient, HttpPath } from '@lib/generic/http-client/domain';

import { AssetsRepository } from '../domain';

export class HttpAssetsRepository extends AssetsRepository {
    readonly #httpClient: HttpClient;

    public constructor(httpClient: HttpClient) {
        super();
        this.#httpClient = httpClient;
    }

    public async get<T>(path: EndpointPath, options?: { abortSignal?: AbortSignal }): Promise<T> {
        const httpPath = HttpPath.create(path.toString());
        const response = await this.#httpClient.get(httpPath.toString(), options);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        return response.body as T;
    }
}
