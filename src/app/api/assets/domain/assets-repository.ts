export abstract class AssetsRepository {
    public abstract get<T>(path: `/${string}`, options?: { abortSignal?: AbortSignal }): Promise<T>;
}
