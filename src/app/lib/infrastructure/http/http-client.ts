import { HttpStatusError } from './error';
import { type HttpRequestExecutor } from './executor';
import { type HttpClient as HttpClientInterface } from './http-client.interface';
import { HttpMethod } from './method';

export class HttpClient implements HttpClientInterface {
    readonly #url: `http://${string}`;
    readonly #requestExecutor: HttpRequestExecutor;

    public constructor(url: `http://${string}`, requestExecutor: HttpRequestExecutor) {
        this.#url = url;
        this.#requestExecutor = requestExecutor;
    }

    public async get<T>(url: string, options?: { abortSignal?: AbortSignal }): Promise<T> {
        return this.#request<T>(
            HttpMethod.Get,
            url,
            {
                abortSignal: options?.abortSignal
            }
        );
    }

    async #request<T>(method: HttpMethod, path: string, options?: { abortSignal?: AbortSignal }): Promise<T> {
        const url = `${this.#url}${path}`;
        const response = await this.#requestExecutor.execute({ url, method, signal: options?.abortSignal });
        if (this.#isErrorStatus(response.status)) {
            throw new HttpStatusError({ status: response.status, statusText: response.statusText, url: response.url, body: response.body });
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Response type cannot be validated at runtime.
        return response.body as T;
    }

    #isErrorStatus(status: number): boolean {
        const httpStatusOkStart = 200;
        const httpStatusOkEnd = 300;
        return status < httpStatusOkStart || status >= httpStatusOkEnd;
    }
}
