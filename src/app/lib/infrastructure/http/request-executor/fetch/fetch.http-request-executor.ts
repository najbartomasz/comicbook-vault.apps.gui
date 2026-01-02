import { type ResponseBodyParser } from '../../body-parser/response-body-parser.interface';
import { TextResponseBodyParser } from '../../body-parser/text/text.response-body-parser';
import { HttpAbortError } from '../../error/abort/http-abort-error';
import { HttpNetworkError } from '../../error/network/http-network-error';
import { HttpPayloadError } from '../../error/payload/http-payload-error';
import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { type HttpRequestExecutor } from '../http-request-executor.interface';

export class FetchHttpRequestExecutor implements HttpRequestExecutor {
    readonly #fetcher: typeof fetch;
    readonly #parsers: readonly ResponseBodyParser[];
    readonly #defaultParser: ResponseBodyParser;

    public constructor(
        bodyParsers: readonly ResponseBodyParser[],
        fetcher: typeof fetch = fetch,
        defaultParser: ResponseBodyParser = new TextResponseBodyParser()
    ) {
        this.#fetcher = fetcher;
        this.#parsers = bodyParsers;
        this.#defaultParser = defaultParser;
    }

    public async execute(request: HttpRequest): Promise<HttpResponse> {
        let response: Response;
        try {
            response = await this.#fetcher(request.url, {
                method: request.method,
                signal: request.signal
            });
        } catch (error: unknown) {
            const { url } = request;
            if (error instanceof DOMException && error.name === 'AbortError') {
                const e = new HttpAbortError({ url }, { cause: error });
                e.stack = error.stack;
                throw e;
            }
            throw new HttpNetworkError({ url, description: this.#getErrorMessage(error) }, { cause: error });
        }
        let responseBody: unknown;
        const contentType = response.headers.get('Content-Type') ?? '';
        try {
            const bodyParser = this.#parsers.find((parser) => parser.canParse(contentType)) ?? this.#defaultParser;
            responseBody = await bodyParser.parse(response);
        } catch (error) {
            throw new HttpPayloadError({ url: response.url }, { cause: error });
        }
        return {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
            body: responseBody
        };
    }

    #getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        if (error && typeof error === 'object' && 'message' in error) {
            return String(error.message);
        }
        return 'Unknown error';
    }
}
