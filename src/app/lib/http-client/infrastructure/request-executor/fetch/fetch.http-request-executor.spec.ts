import { stubResponse } from '@testing/unit/http';

import { HttpMethod, type HttpRequest } from '../../../domain';
import { JsonResponseBodyParser } from '../../body-parsers/json/json.response-body-parser';
import { type ResponseBodyParser } from '../../body-parsers/response-body-parser.interface';
import { TextPlainResponseBodyParser } from '../../body-parsers/text/text-plain.response-body-parser';
import { HttpAbortError } from '../../errors/abort/http-abort-error';
import { HttpNetworkError } from '../../errors/network/http-network-error';
import { HttpPayloadError } from '../../errors/payload/http-payload-error';

import { FetchHttpRequestExecutor } from './fetch.http-request-executor';

describe(FetchHttpRequestExecutor, () => {
    test('should return response with JSON body when content-type is application/json', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: { data: 'test' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When
        const result = await httpRequestExecutor.execute(request);

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
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: 'plain text response',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([new TextPlainResponseBodyParser()]);

        // When
        const result = await httpRequestExecutor.execute(request);

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
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: 'response without content-type',
                status: 200,
                statusText: 'OK',
                headers: new Headers()
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([new TextPlainResponseBodyParser()]);

        // When
        const result = await httpRequestExecutor.execute(request);

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
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: { error: 'not found' },
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When
        const result = await httpRequestExecutor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 404,
            statusText: 'Not Found',
            url: 'https://example.com/api',
            body: { error: 'not found' }
        });
    });

    test('should return undefined body for 204 No Content responses', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                status: 204,
                statusText: 'No Content'
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When
        const result = await httpRequestExecutor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 204,
            statusText: 'No Content',
            url: 'https://example.com/api',
            body: undefined
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
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValueOnce(abortError));
        const httpRequestExecutor = new FetchHttpRequestExecutor([]);

        // When, Then
        await expect(async () => httpRequestExecutor.execute(request)).rejects.toThrowError(
            new HttpAbortError({ url: 'https://example.com/api' }, { cause: abortError })
        );
    });

    test('should throw network error when fetch fails with an exception', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const networkError = new Error('Network failure');
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValueOnce(networkError));
        const httpRequestExecutor = new FetchHttpRequestExecutor([]);

        // When, Then
        await expect(async () => httpRequestExecutor.execute(request)).rejects.toThrowError(
            new HttpNetworkError({ url: 'https://example.com/api', description: 'Network failure' }, { cause: networkError })
        );
    });

    test('should throw network error when fetch fails with a primitive value', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const primitiveError = 'Network unreachable';
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValueOnce(primitiveError));
        const httpRequestExecutor = new FetchHttpRequestExecutor([]);

        // When, Then
        await expect(async () => httpRequestExecutor.execute(request)).rejects.toThrowError(
            new HttpNetworkError({ url: 'https://example.com/api', description: 'Network unreachable' }, { cause: primitiveError })
        );
    });

    test('should throw network error with object message when fetch fails with object containing message property', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const objectError = { message: 'Connection timeout', code: 'ETIMEDOUT' };
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValueOnce(objectError));
        const httpRequestExecutor = new FetchHttpRequestExecutor([]);

        // When, Then
        await expect(async () => httpRequestExecutor.execute(request)).rejects.toThrowError(
            new HttpNetworkError({ url: 'https://example.com/api', description: 'Connection timeout' }, { cause: objectError })
        );
    });

    test('should throw network error with "Unknown error" when fetch fails with non-standard value', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const unknownError = 42;
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValueOnce(unknownError));
        const httpRequestExecutor = new FetchHttpRequestExecutor([]);

        // When, Then
        await expect(async () => httpRequestExecutor.execute(request)).rejects.toThrowError(
            new HttpNetworkError({ url: 'https://example.com/api', description: 'Unknown error' }, { cause: unknownError })
        );
    });

    test('should throw network error with "Unknown error" when fetch fails with null', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValueOnce(null));
        const httpRequestExecutor = new FetchHttpRequestExecutor([]);

        // When, Then
        await expect(async () => httpRequestExecutor.execute(request)).rejects.toThrowError(
            new HttpNetworkError({ url: 'https://example.com/api', description: 'Unknown error' }, { cause: null })
        );
    });

    test('should throw payload error when JSON parsing fails', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: 'invalid json',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When, Then
        await expect(async () => httpRequestExecutor.execute(request)).rejects.toThrowError(
            new HttpPayloadError({ url: 'https://example.com/api' }, { cause: expect.any(SyntaxError) })
        );
    });

    test('should throw payload error when text parsing fails', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const responseStub = stubResponse({
            url: 'https://example.com/api',
            body: 'some text',
            status: 200,
            statusText: 'OK',
            headers: new Headers({ 'Content-Type': 'text/plain' })
        });
        vi.spyOn(responseStub, 'text').mockRejectedValue(new TypeError('Failed to read body'));
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(responseStub));
        const httpRequestExecutor = new FetchHttpRequestExecutor([new TextPlainResponseBodyParser()]);

        // When, Then
        await expect(async () => httpRequestExecutor.execute(request)).rejects.toThrowError(
            new HttpPayloadError({ url: 'https://example.com/api' }, { cause: new TypeError('Failed to read body') })
        );
    });

    test('should use first parser that returns non-undefined result', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const parser1ParseMock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue(undefined);
        const parser1Stub: ResponseBodyParser = {
            parse: parser1ParseMock
        };
        const parser2ParseMock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue({ data: 'test' });
        const parser2Stub: ResponseBodyParser = {
            parse: parser2ParseMock
        };
        const responseStub = stubResponse({
            url: 'https://example.com/api',
            body: { data: 'test' },
            status: 200,
            statusText: 'OK',
            headers: new Headers({ 'Content-Type': 'application/json' })
        });
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(responseStub));
        const httpRequestExecutor = new FetchHttpRequestExecutor([parser1Stub, parser2Stub]);

        // When
        await httpRequestExecutor.execute(request);

        // Then
        expect(parser1ParseMock).toHaveBeenCalledExactlyOnceWith(responseStub);
        expect(parser2ParseMock).toHaveBeenCalledExactlyOnceWith(responseStub);
    });

    test('should use first parser that successfully parses when multiple parsers could handle content-type', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const parser1ParseMock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue({ data: 'test' });
        const parser1Stub: ResponseBodyParser = {
            parse: parser1ParseMock
        };
        const parser2ParseMock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue({ data: 'test' });
        const parser2Stub: ResponseBodyParser = {
            parse: parser2ParseMock
        };
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: { data: 'test' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([parser1Stub, parser2Stub]);

        // When
        await httpRequestExecutor.execute(request);

        // Then
        expect(parser1ParseMock).toHaveBeenCalledTimes(1);
        expect(parser2ParseMock).not.toHaveBeenCalled();
    });

    test('should try parsers in exact order until one returns non-undefined', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: { data: 'success' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const parser1Mock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue(undefined);
        const parser2Mock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue(undefined);
        const parser3Mock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue({ data: 'success' });
        const parser4Mock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue({ data: 'should not be called' });
        const httpRequestExecutor = new FetchHttpRequestExecutor([
            { parse: parser1Mock },
            { parse: parser2Mock },
            { parse: parser3Mock },
            { parse: parser4Mock }
        ]);

        // When
        const result = await httpRequestExecutor.execute(request);

        // Then
        expect(parser1Mock).toHaveBeenCalledBefore(parser2Mock);
        expect(parser2Mock).toHaveBeenCalledBefore(parser3Mock);
        expect(parser4Mock).not.toHaveBeenCalled();
        expect(result.body).toStrictEqual({ data: 'success' });
    });

    test('should fall back to default text parser when all parsers return undefined', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: 'text content',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When
        const result = await httpRequestExecutor.execute(request);

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
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: 'any content',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([]);

        // When
        const result = await httpRequestExecutor.execute(request);

        // Then
        expect(result.body).toBe('any content');
    });

    test('should use custom default parser when all parsers return undefined', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const customDefaultParserMock = vi.fn<ResponseBodyParser['parse']>().mockResolvedValue('custom parsed');
        const customDefaultParserStub: ResponseBodyParser = {
            parse: customDefaultParserMock
        };
        const fetcherMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: 'some content',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/xml' })
            })
        );
        const httpRequestExecutor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()], customDefaultParserStub, fetcherMock);

        // When
        const result = await httpRequestExecutor.execute(request);

        // Then
        expect(result.body).toBe('custom parsed');
        expect(customDefaultParserMock).toHaveBeenCalledTimes(1);
    });

    test('should return final URL when response URL differs from request URL due to redirects', async () => {
        // Given
        const request: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api/v2/resource',
                body: { data: 'redirected' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const httpRequestExecutor = new FetchHttpRequestExecutor([new JsonResponseBodyParser()]);

        // When
        const result = await httpRequestExecutor.execute(request);

        // Then
        expect(result.url).toBe('https://example.com/api/v2/resource');
        expect(result.body).toStrictEqual({ data: 'redirected' });
    });
});
