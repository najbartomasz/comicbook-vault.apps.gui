import { type EndpointPath } from '@lib/endpoint/domain';

export abstract class VaultRepository {
    public abstract get<T>(path: EndpointPath, options?: { abortSignal?: AbortSignal }): Promise<T>;
}
