import { type HttpRequestExecutor } from './executor';
import { type HttpClient } from './http-client.interface';
import { type HttpInterceptor } from './http-interceptor.type';
import { type HttpRequest } from './http-request.interface';
import { type HttpResponse } from './http-response.interface';
import { type HttpUrl } from './http-url.type';
import { type HttpRequestInterceptor } from './interceptor/http-request-interceptor.interface';
import { type HttpResponseInterceptor } from './interceptor/http-response-interceptor.interface';
import { HttpMethod } from './method';

export class FetchHttpClient implements HttpClient {
    readonly #url: HttpUrl;
    readonly #requestExecutor: HttpRequestExecutor;
    readonly #requestInterceptors: readonly HttpRequestInterceptor[];
    readonly #responseInterceptors: readonly HttpResponseInterceptor[];

    public constructor(url: HttpUrl, requestExecutor: HttpRequestExecutor, interceptors: readonly HttpInterceptor[] = []) {
        this.#url = url;
        this.#requestExecutor = requestExecutor;
        this.#requestInterceptors = interceptors.filter((interceptor) => 'interceptRequest' in interceptor);
        this.#responseInterceptors = interceptors.filter((interceptor) => 'interceptResponse' in interceptor);
    }

    public async get(url: string, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        return this.#request(HttpMethod.Get, url, { abortSignal: options?.abortSignal });
    }

    async #request(method: HttpMethod, path: string, options?: { abortSignal?: AbortSignal }): Promise<HttpResponse> {
        const url = `${this.#url}${path}`;
        const request = this.#interceptRequest({ url, method, signal: options?.abortSignal });
        const response = await this.#requestExecutor.execute(request);
        return this.#interceptResponse(response, request);
    }

    #interceptRequest(request: HttpRequest): HttpRequest {
        return this.#requestInterceptors
            .reduce((currentRequest, interceptor) => interceptor.interceptRequest(currentRequest), request);
    }

    #interceptResponse(response: HttpResponse, request: HttpRequest): HttpResponse {
        return this.#responseInterceptors
            .reduce((currentResponse, interceptor) => interceptor.interceptResponse(currentResponse, request), response);
    }
}
