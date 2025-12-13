export interface HttpClient {
    get<T>(url: string, options?: { abortSignal?: AbortSignal }): Promise<T>;
}
