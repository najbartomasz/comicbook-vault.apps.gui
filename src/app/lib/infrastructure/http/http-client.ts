import { type HttpRequestExecutor } from './executor';
import { type HttpClient as HttpClientInterface } from './http-client.interface';
import { type HttpResponse } from './http-response.interface';
import { HttpMethod } from './method';

export class HttpClient implements HttpClientInterface {
    readonly #url: `http://${string}`;
    readonly #requestExecutor: HttpRequestExecutor;

    public constructor(url: `http://${string}`, requestExecutor: HttpRequestExecutor) {
        this.#url = url;
        this.#requestExecutor = requestExecutor;
    }

    public async get(url: string, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        return this.#request(
            HttpMethod.Get,
            url,
            {
                abortSignal: options?.abortSignal
            }
        );
    }

    async #request(method: HttpMethod, path: string, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        const url = `${this.#url}${path}`;
        return this.#requestExecutor.execute({ url, method, signal: options?.abortSignal });
    }
}
