import { type HttpPath } from '@lib/http-client/domain';

export abstract class AssetsRepository {
    public abstract get<T>(path: HttpPath, options?: { abortSignal?: AbortSignal }): Promise<T>;
}
