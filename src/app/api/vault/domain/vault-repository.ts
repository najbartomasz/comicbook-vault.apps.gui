export abstract class VaultRepository {
    public abstract get<T>(path: `/${string}`, options?: { abortSignal?: AbortSignal }): Promise<T>;
}
