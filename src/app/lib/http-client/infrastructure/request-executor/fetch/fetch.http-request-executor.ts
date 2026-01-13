import { type HttpRequest, type HttpResponse } from '../../../domain';
import { type ResponseBodyParser } from '../../body-parsers/response-body-parser.interface';
import { TextPlainResponseBodyParser } from '../../body-parsers/text/text-plain.response-body-parser';
import { HttpAbortError } from '../../errors/abort/http-abort-error';
import { HttpNetworkError } from '../../errors/network/http-network-error';
import { HttpPayloadError } from '../../errors/payload/http-payload-error';
import { type HttpRequestExecutor } from '../http-request-executor.interface';

export class FetchHttpRequestExecutor implements HttpRequestExecutor {
    readonly #fetcher: typeof fetch;
    readonly #parsers: readonly ResponseBodyParser[];
    readonly #defaultParser: ResponseBodyParser;

    public constructor(
        bodyParsers: readonly ResponseBodyParser[],
        defaultParser: ResponseBodyParser = new TextPlainResponseBodyParser(),
        fetcher: typeof fetch = async (url, options) => fetch(url, options)
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
