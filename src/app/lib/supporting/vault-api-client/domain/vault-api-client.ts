import { type EndpointPath } from '@lib/generic/endpoint/domain';

export abstract class VaultApiClient {
    public abstract get<T>(path: EndpointPath, options?: { abortSignal?: AbortSignal }): Promise<T>;
}
