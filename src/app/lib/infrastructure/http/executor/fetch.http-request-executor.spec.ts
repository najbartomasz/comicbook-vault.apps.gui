import { when } from 'vitest-when';

import { HttpAbortError } from '../error/http-abort-error';
import { HttpNetworkError } from '../error/http-network-error';
import { HttpPayloadError } from '../error/http-payload-error';
import { type HttpRequest } from '../http-request.interface';
import { HttpMethod } from '../method/http-method';

import { FetchHttpRequestExecutor } from './fetch.http-request-executor';
import { JsonResponseBodyParser, ResponseBodyParserResolver, TextResponseBodyParser } from './parser';

describe(FetchHttpRequestExecutor, () => {
    const createResponseStub = (url: string, body: BodyInit, init: ResponseInit): Response => {
        const response = new Response(body, init);
        Object.defineProperty(response, 'url', { value: url });
        return response;
    };

    test('should return response with JSON body when content-type is application/json', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenResolve(createResponseStub(
                request.url,
                JSON.stringify({ data: 'test' }),
                {
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    status: 200,
                    statusText: 'OK'
                }
            ));
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([new JsonResponseBodyParser()]));

        // When
        const result = await executor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/api',
            body: { data: 'test' }
        });
    });

    test('should return response with text body when content-type is text/plain', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenResolve(createResponseStub(
                request.url,
                'plain text response',
                {
                    headers: new Headers({ 'Content-Type': 'text/plain' }),
                    status: 200,
                    statusText: 'OK'
                }
            ));
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([new TextResponseBodyParser()]));

        // When
        const result = await executor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/api',
            body: 'plain text response'
        });
    });

    test('should return response with text body when content-type header is missing', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const responseStub = createResponseStub(
            request.url,
            'response without content-type',
            {
                status: 200,
                statusText: 'OK'
            }
        );
        vi.spyOn(responseStub.headers, 'get').mockReturnValue(null);
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenResolve(responseStub);
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([new TextResponseBodyParser()]));

        // When
        const result = await executor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/api',
            body: 'response without content-type'
        });
    });

    test('should return response without throwing when status indicates error', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenResolve(createResponseStub(
                request.url,
                JSON.stringify({ error: 'not found' }),
                {
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    status: 404,
                    statusText: 'Not Found'
                }
            ));
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([new JsonResponseBodyParser()]));

        // When
        const result = await executor.execute(request);

        // Then
        expect(result).toStrictEqual({
            status: 404,
            statusText: 'Not Found',
            url: 'http://example.com/api',
            body: { error: 'not found' }
        });
    });

    test('should throw abort error when fetch is aborted', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const abortError = new DOMException('The operation was aborted.', 'AbortError');
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenReject(abortError);
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([]));

        // When, Then
        const error: HttpAbortError = await executor.execute(request).catch((err: unknown) => err as HttpAbortError) as HttpAbortError;

        expect(error).toBeInstanceOf(HttpAbortError);
        expect(error.url).toBe('http://example.com/api');
        expect(error.cause).toBe(abortError);
    });

    test('should throw network error when fetch fails with an exception', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const networkError = new Error('Network failure');
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenReject(networkError);
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([]));

        // When, Then
        const error = await executor.execute(request).catch((err: unknown) => err as HttpNetworkError) as HttpNetworkError;

        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error.url).toBe('http://example.com/api');
        expect(error.description).toBe('Network failure');
        expect(error.cause).toBe(networkError);
    });

    test('should throw network error when fetch fails with a primitive value', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const primitiveError = 'Network unreachable';
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenReject(primitiveError);
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([]));

        // When, Then
        const error = await executor.execute(request).catch((err: unknown) => err as HttpNetworkError) as HttpNetworkError;

        expect(error).toBeInstanceOf(HttpNetworkError);
        expect(error.url).toBe('http://example.com/api');
        expect(error.description).toBe('Network unreachable');
        expect(error.cause).toBe(primitiveError);
    });

    test('should throw payload error when JSON parsing fails', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenResolve(createResponseStub(
                request.url,
                'invalid json',
                {
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    status: 200,
                    statusText: 'OK'
                }
            ));
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([new JsonResponseBodyParser()]));

        // When, Then
        const error = await executor.execute(request).catch((err: unknown) => err as HttpPayloadError) as HttpPayloadError;

        expect(error).toBeInstanceOf(HttpPayloadError);
        expect(error.url).toBe('http://example.com/api');
        expect(error.description).toBe('Failed to parse response as JSON');
        expect(error.cause).toBeInstanceOf(SyntaxError);
    });

    test('should throw payload error when text parsing fails', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        const responseStub = createResponseStub(
            request.url,
            'some text',
            {
                headers: new Headers({ 'Content-Type': 'text/plain' }),
                status: 200,
                statusText: 'OK'
            }
        );
        const textError = new TypeError('Failed to read body');
        vi.spyOn(responseStub, 'text').mockRejectedValue(textError);
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenResolve(responseStub);
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([new TextResponseBodyParser()]));

        // When, Then
        const error = await executor.execute(request).catch((err: unknown) => err as HttpPayloadError) as HttpPayloadError;

        expect(error).toBeInstanceOf(HttpPayloadError);
        expect(error.url).toBe('http://example.com/api');
        expect(error.description).toBe('Failed to parse response as JSON');
        expect(error.cause).toBe(textError);
    });
});
