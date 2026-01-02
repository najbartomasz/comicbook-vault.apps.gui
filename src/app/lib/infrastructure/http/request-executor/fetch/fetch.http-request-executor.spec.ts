import { JsonResponseBodyParser } from '../../body-parser/json/json.response-body-parser';
import { type ResponseBodyParser } from '../../body-parser/response-body-parser.interface';
import { TextResponseBodyParser } from '../../body-parser/text/text.response-body-parser';
import { HttpAbortError } from '../../error/abort/http-abort-error';
import { HttpNetworkError } from '../../error/network/http-network-error';
import { HttpPayloadError } from '../../error/payload/http-payload-error';
import { type HttpRequest } from '../../http-request.interface';
import { HttpMethod } from '../../method/http-method';

import { FetchHttpRequestExecutor } from './fetch.http-request-executor';

describe(FetchHttpRequestExecutor, () => {
    const createResponseStub = (url: string, body: BodyInit, init: ResponseInit): Response => {
        const responseStub = new Response(body, init);
        Object.defineProperty(responseStub, 'url', { value: url });
        return responseStub;
    };

    const mockFetch = (response: Response): void => {
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(response));
    };

    const mockFetchError = (error: unknown): void => {
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValueOnce(error));
    };

    test('should return response with JSON body when content-type is application/json', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        mockFetch(createResponseStub(
            'https://example.com/api',
            JSON.stringify({ data: 'test' }),
            {
                headers: new Headers({ 'Content-Type': 'application/json' }),
                status: 200,
                statusText: 'OK'
            }
        ));
        const executor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When
        const result = await executor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'https://example.com/api',
            body: { data: 'test' }
        });
    });

    test('should return response with text body when content-type is text/plain', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        mockFetch(createResponseStub(
            'https://example.com/api',
            'plain text response',
            {
                headers: new Headers({ 'Content-Type': 'text/plain' }),
                status: 200,
                statusText: 'OK'
            }
        ));
        const executor = new FetchHttpRequestExecutor([new TextResponseBodyParser()]);

        // When
        const result = await executor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'https://example.com/api',
            body: 'plain text response'
        });
    });

    test('should return response with text body when content-type header is missing', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const responseStub = createResponseStub(
            'https://example.com/api',
            'response without content-type',
            {
                status: 200,
                statusText: 'OK'
            }
        );
        vi.spyOn(responseStub.headers, 'get').mockReturnValueOnce(null);
        mockFetch(responseStub);
        const executor = new FetchHttpRequestExecutor([new TextResponseBodyParser()]);

        // When
        const result = await executor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'https://example.com/api',
            body: 'response without content-type'
        });
    });

    test('should return response without throwing when status indicates error', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        mockFetch(createResponseStub(
            'https://example.com/api',
            JSON.stringify({ error: 'not found' }),
            {
                headers: new Headers({ 'Content-Type': 'application/json' }),
                status: 404,
                statusText: 'Not Found'
            }
        ));
        const executor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When
        const result = await executor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 404,
            statusText: 'Not Found',
            url: 'https://example.com/api',
            body: { error: 'not found' }
        });
    });

    test('should throw abort error when fetch is aborted', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const abortError = new DOMException('The operation was aborted.', 'AbortError');
        mockFetchError(abortError);
        const executor = new FetchHttpRequestExecutor([]);

        // When
        const error = await executor.execute(request).catch((err: unknown) => err as HttpAbortError) as HttpAbortError;

        // Then
        expect(error).toBeInstanceOf(HttpAbortError);
        expect(error.url).toBe('https://example.com/api');
        expect(error.cause).toBe(abortError);
    });

    test('should throw network error when fetch fails with an exception', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const networkError = new Error('Network failure');
        mockFetchError(networkError);
        const executor = new FetchHttpRequestExecutor([]);

        // When
        const error = await executor.execute(request).catch((err: unknown) => err as HttpNetworkError) as HttpNetworkError;

        // Then
        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error.url).toBe('https://example.com/api');
        expect(error.description).toBe('Network failure');
        expect(error.cause).toBe(networkError);
    });

    test('should throw network error when fetch fails with a primitive value', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const primitiveError = 'Network unreachable';
        mockFetchError(primitiveError);
        const executor = new FetchHttpRequestExecutor([]);

        // When
        const error = await executor.execute(request).catch((err: unknown) => err as HttpNetworkError) as HttpNetworkError;

        // Then
        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error.url).toBe('https://example.com/api');
        expect(error.description).toBe('Network unreachable');
        expect(error.cause).toBe(primitiveError);
    });

    test('should throw network error with object message when fetch fails with object containing message property', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const objectError = { message: 'Connection timeout', code: 'ETIMEDOUT' };
        mockFetchError(objectError);
        const executor = new FetchHttpRequestExecutor([]);

        // When
        const error = await executor.execute(request).catch((err: unknown) => err as HttpNetworkError) as HttpNetworkError;

        // Then
        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error.url).toBe('https://example.com/api');
        expect(error.description).toBe('Connection timeout');
        expect(error.cause).toBe(objectError);
    });

    test('should throw network error with "Unknown error" when fetch fails with non-standard value', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const unknownError = 42;
        mockFetchError(unknownError);
        const executor = new FetchHttpRequestExecutor([]);

        // When
        const error = await executor.execute(request).catch((err: unknown) => err as HttpNetworkError) as HttpNetworkError;

        // Then
        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error.url).toBe('https://example.com/api');
        expect(error.description).toBe('Unknown error');
        expect(error.cause).toBe(unknownError);
    });

    test('should throw network error with "Unknown error" when fetch fails with null', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        mockFetchError(null);
        const executor = new FetchHttpRequestExecutor([]);

        // When
        const error = await executor.execute(request).catch((err: unknown) => err as HttpNetworkError) as HttpNetworkError;

        // Then
        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error.url).toBe('https://example.com/api');
        expect(error.description).toBe('Unknown error');
        expect(error.cause).toBeNull();
    });

    test('should throw payload error when JSON parsing fails', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        mockFetch(createResponseStub(
            'https://example.com/api',
            'invalid json',
            {
                headers: new Headers({ 'Content-Type': 'application/json' }),
                status: 200,
                statusText: 'OK'
            }
        ));
        const executor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When
        const error = await executor.execute(request).catch((err: unknown) => err as HttpPayloadError) as HttpPayloadError;

        // Then
        expect(error).toBeInstanceOf(HttpPayloadError);
        expect(error.url).toBe('https://example.com/api');
        expect(error.description).toBe('Failed to parse response');
        expect(error.cause).toBeInstanceOf(SyntaxError);
    });

    test('should throw payload error when text parsing fails', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const responseStub = createResponseStub(
            'https://example.com/api',
            'some text',
            {
                headers: new Headers({ 'Content-Type': 'text/plain' }),
                status: 200,
                statusText: 'OK'
            }
        );
        const textError = new TypeError('Failed to read body');
        vi.spyOn(responseStub, 'text').mockRejectedValue(textError);
        mockFetch(responseStub);
        const executor = new FetchHttpRequestExecutor([new TextResponseBodyParser()]);

        // When
        const error = await executor.execute(request).catch((err: unknown) => err as HttpPayloadError) as HttpPayloadError;

        // Then
        expect(error).toBeInstanceOf(HttpPayloadError);
        expect(error.url).toBe('https://example.com/api');
        expect(error.description).toBe('Failed to parse response');
        expect(error.cause).toBe(textError);
    });

    test('should use first matching parser', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const parser1ParseMock = vi.fn<ResponseBodyParser['parse']>();
        const parser1Stub: ResponseBodyParser = {
            canParse: () => false,
            parse: parser1ParseMock
        };
        const parser2ParseMock = vi.fn<ResponseBodyParser['parse']>();
        const parser2Stub: ResponseBodyParser = {
            canParse: () => true,
            parse: parser2ParseMock
        };
        mockFetch(createResponseStub(
            'https://example.com/api',
            JSON.stringify({ data: 'test' }),
            {
                headers: new Headers({ 'Content-Type': 'application/json' }),
                status: 200,
                statusText: 'OK'
            }
        ));
        const executor = new FetchHttpRequestExecutor([parser1Stub, parser2Stub]);

        // When
        await executor.execute(request);

        // Then
        expect(parser1ParseMock).not.toHaveBeenCalled();
        expect(parser2ParseMock).toHaveBeenCalledTimes(1);
    });

    test('should use first matching parser when multiple parsers match content-type', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const parser1ParseMock = vi.fn<ResponseBodyParser['parse']>();
        const parser1Stub: ResponseBodyParser = {
            canParse: () => true,
            parse: parser1ParseMock
        };
        const parser2ParseMock = vi.fn<ResponseBodyParser['parse']>();
        const parser2Stub: ResponseBodyParser = {
            canParse: () => true,
            parse: parser2ParseMock
        };
        mockFetch(createResponseStub(
            'https://example.com/api',
            JSON.stringify({ data: 'test' }),
            {
                headers: new Headers({ 'Content-Type': 'application/json' }),
                status: 200,
                statusText: 'OK'
            }
        ));
        const executor = new FetchHttpRequestExecutor([parser1Stub, parser2Stub]);

        // When
        await executor.execute(request);

        // Then
        expect(parser1ParseMock).toHaveBeenCalledTimes(1);
        expect(parser2ParseMock).not.toHaveBeenCalled();
    });

    test('should fall back to default text parser when no parser matches content-type', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        mockFetch(createResponseStub(
            'https://example.com/api',
            'text content',
            {
                headers: new Headers({ 'Content-Type': 'text/plain' }),
                status: 200,
                statusText: 'OK'
            }
        ));
        const executor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When
        const result = await executor.execute(request);

        // Then
        expect(result.body).toBe('text content');
    });

    test('should fall back to default text parser when no parsers provided', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        mockFetch(createResponseStub(
            'https://example.com/api',
            'any content',
            {
                headers: new Headers({ 'Content-Type': 'application/json' }),
                status: 200,
                statusText: 'OK'
            }
        ));
        const executor = new FetchHttpRequestExecutor([]);

        // When
        const result = await executor.execute(request);

        // Then
        expect(result.body).toBe('any content');
    });

    test('should use custom default parser when no parser matches', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const customDefaultParserMock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue('custom parsed');
        const customDefaultParserStub: ResponseBodyParser = {
            canParse: () => true,
            parse: customDefaultParserMock
        };
        mockFetch(createResponseStub(
            'https://example.com/api',
            'some content',
            {
                headers: new Headers({ 'Content-Type': 'application/xml' }),
                status: 200,
                statusText: 'OK'
            }
        ));
        const executor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()], fetch, customDefaultParserStub);

        // When
        const result = await executor.execute(request);

        // Then
        expect(result.body).toBe('custom parsed');
        expect(customDefaultParserMock).toHaveBeenCalledTimes(1);
    });
});
