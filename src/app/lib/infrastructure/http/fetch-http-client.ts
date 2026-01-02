import { type ResponseBodyParser } from './body-parser/response-body-parser.interface';
import { type HttpClient } from './http-client.interface';
import { type HttpRequest } from './http-request.interface';
import { type HttpResponse } from './http-response.interface';
import { type HttpUrl } from './http-url.type';
import { type HttpInterceptor } from './interceptor/http-interceptor.interface';
import { HttpMethod } from './method/http-method';
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

    public async get(url: string, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        return this.#request(HttpMethod.Get, url, { abortSignal: options?.abortSignal });
    }

    async #request(method: HttpMethod, path: string, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        const url = `${this.#url}${path}`;
        const request: HttpRequest = { url, method, signal: options?.abortSignal };
        const intercept = this.#interceptors.reduceRight(
            (next, interceptor) => async (req: HttpRequest) => interceptor.intercept(req, next),
            async (req: HttpRequest) => this.#requestExecutor.execute(req)
        );
        return intercept(request);
    }
}
