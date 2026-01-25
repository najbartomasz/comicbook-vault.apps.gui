import {
    type HttpClient,
    type HttpInterceptor,
    HttpMethod,
    type HttpPath,
    type HttpRequest,
    type HttpResponse,
    type HttpUrl
} from '../domain';

import { type ResponseBodyParser } from './body-parsers/response-body-parser.interface';
import { FetchHttpRequestExecutor } from './request-executor/fetch/fetch.http-request-executor';
import { type HttpRequestExecutor } from './request-executor/http-request-executor.interface';

export class FetchHttpClient implements HttpClient {
    readonly #baseUrl: string;
    readonly #requestExecutor: HttpRequestExecutor;
    readonly #interceptors: readonly HttpInterceptor[];

    public constructor(
        url: HttpUrl,
        bodyParsers: readonly ResponseBodyParser[],
        interceptors: readonly HttpInterceptor[] = [],
        requestExecutor: HttpRequestExecutor = new FetchHttpRequestExecutor(bodyParsers)
    ) {
        const baseUrl = url.toString();
        this.#baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        this.#interceptors = interceptors;
        this.#requestExecutor = requestExecutor;
    }

    public async get(path: HttpPath, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        return this.#request(HttpMethod.Get, path, { abortSignal: options?.abortSignal });
    }

    async #request(method: HttpMethod, path: HttpPath, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        const endpoint = path.toString().substring(1);
        const url = new URL(endpoint, this.#baseUrl).toString();
        const request: HttpRequest = { url, method, signal: options?.abortSignal };
        const intercept = this.#interceptors.reduceRight(
            (next, interceptor) => async (req: HttpRequest) => interceptor.intercept(req, next),
            async (req: HttpRequest) => this.#requestExecutor.execute(req)
        );
        return intercept(request);
    }
}
