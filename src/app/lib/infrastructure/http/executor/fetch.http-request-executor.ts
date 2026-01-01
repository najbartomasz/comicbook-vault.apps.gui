import { HttpAbortError, HttpNetworkError, HttpPayloadError } from '../error';
import { type HttpRequest } from '../http-request.interface';
import { type HttpResponse } from '../http-response.interface';

import { type HttpRequestExecutor } from './http-request-executor.interface';
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
            const { url } = request;
            if (error instanceof DOMException && error.name === 'AbortError') {
                const e = new HttpAbortError({ url }, { cause: error });
                e.stack = error.stack;
                throw e;
            }
            throw new HttpNetworkError({ url, description: (error instanceof Error) ? error.message : String(error) }, { cause: error });
        }
        let responseBody: unknown;
        const contentType = response.headers.get('Content-Type') ?? '';
        try {
            const parser = this.#parserResolver.resolve(contentType);
            responseBody = await parser.parse(response);
        } catch (error) {
            throw new HttpPayloadError({ url: response.url }, { cause: error });
        }
        return {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            body: responseBody
        };
    }
}
