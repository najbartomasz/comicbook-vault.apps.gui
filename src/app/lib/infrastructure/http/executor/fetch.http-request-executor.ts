import { HttpAbortError } from '../error/http-abort-error';
import { HttpNetworkError } from '../error/http-network-error';
import { HttpPayloadError } from '../error/http-payload-error';

import { type HttpRequestExecutor } from './http-request-executor.interface';
import { type HttpRequest } from './http-request.interface';
import { type HttpResponse } from './http-response.interface';
import { type ResponseBodyParserResolver } from './parser';

export class FetchHttpRequestExecutor implements HttpRequestExecutor {
    readonly #fetcher: typeof fetch;
    readonly #parserResolver: ResponseBodyParserResolver;

    public constructor(parserResolver: ResponseBodyParserResolver, fetcher: typeof fetch = fetch) {
        this.#fetcher = fetcher;
        this.#parserResolver = parserResolver;
    }

    public async execute(request: HttpRequest): Promise<HttpResponse> {
        let response: Response;
        try {
            response = await this.#fetcher(request.url, {
                method: request.method,
                signal: request.signal
            });
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new HttpAbortError({ url: request.url });
            }
            throw new HttpNetworkError({ url: request.url, description: (error instanceof Error) ? error.message : String(error) });
        }
        let responseBody: unknown;
        const contentType = response.headers.get('Content-Type') ?? '';
        try {
            const parser = this.#parserResolver.resolve(contentType);
            responseBody = await parser.parse(response);
        } catch {
            throw new HttpPayloadError({ url: response.url });
        }
        return {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            body: responseBody
        };
    }
}
