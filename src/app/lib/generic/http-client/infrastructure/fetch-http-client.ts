import { type HttpInterceptor } from '../application';
import { type HttpClient, HttpMethod, type HttpPath, type HttpRequest, type HttpResponse, type HttpUrl } from '../domain';

import { type ResponseBodyParser } from './body-parsers/response-body-parser.interface';
import { FetchHttpRequestExecutor } from './request-executor/fetch/fetch.http-request-executor';
import { type HttpRequestExecutor } from './request-executor/http-request-executor.interface';

export class FetchHttpClient implements HttpClient {
    readonly #url: HttpUrl;
    readonly #requestExecutor: HttpRequestExecutor;
    readonly #interceptors: readonly HttpInterceptor[];

    public constructor(
        url: HttpUrl,
        bodyParsers: readonly ResponseBodyParser[],
        interceptors: readonly HttpInterceptor[] = [],
        requestExecutor: HttpRequestExecutor = new FetchHttpRequestExecutor(bodyParsers)
    ) {
        this.#url = url;
        this.#interceptors = interceptors;
        this.#requestExecutor = requestExecutor;
    }

    public async get(path: HttpPath, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        return this.#request(HttpMethod.Get, path, { abortSignal: options?.abortSignal });
    }

    async #request(method: HttpMethod, path: HttpPath, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        const url = `${this.#url.toString()}${path.toString()}`;
        const request: HttpRequest = { url, method, signal: options?.abortSignal };
        const intercept = this.#interceptors.reduceRight(
            (next, interceptor) => async (req: HttpRequest) => interceptor.intercept(req, next),
            async (req: HttpRequest) => this.#requestExecutor.execute(req)
        );
        return intercept(request);
    }
}
