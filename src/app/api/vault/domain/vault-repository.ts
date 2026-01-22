import { type HttpPath } from '@lib/http-client/domain';

export abstract class VaultRepository {
    public abstract get<T>(path: HttpPath, options?: { abortSignal?: AbortSignal }): Promise<T>;
}
