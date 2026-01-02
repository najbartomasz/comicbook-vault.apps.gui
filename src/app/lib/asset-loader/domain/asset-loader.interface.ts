export interface AssetLoader {
    load<T>(path: string, validator: (data: unknown) => T): Promise<T>;
}
