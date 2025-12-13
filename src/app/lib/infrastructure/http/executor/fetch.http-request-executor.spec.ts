import { describe, expect, spyOn, test, when } from '@testing/unit';

import { HttpAbortError } from '../error/http-abort-error';
import { HttpNetworkError } from '../error/http-network-error';
import { HttpPayloadError } from '../error/http-payload-error';
import { HttpMethod } from '../method/http-method';

import { FetchHttpRequestExecutor } from './fetch.http-request-executor';
import { type HttpRequest } from './http-request.interface';
import { JsonResponseBodyParser, ResponseBodyParserResolver, TextResponseBodyParser } from './parser';

describe(FetchHttpRequestExecutor, () => {
    const createResponseStub = (url: string, body: BodyInit, init: ResponseInit): Response => {
        const response = new Response(body, init);
        Object.defineProperty(response, 'url', { value: url });
        return response;
    };

    test('should return response with JSON body when content-type is application/json', async () => {
        // Given
        const fetchMock = spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/resource',
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
        expect(result).toEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: { data: 'test' }
        });
    });

    test('should return response with text body when content-type is text/plain', async () => {
        // Given
        const fetchMock = spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/resource',
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
        expect(result).toEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: 'plain text response'
        });
    });

    test('should return response with text body when content-type header is missing', async () => {
        // Given
        const fetchMock = spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/resource',
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
        spyOn(responseStub.headers, 'get').mockReturnValue(null);
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenResolve(responseStub);
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([new TextResponseBodyParser()]));

        // When
        const result = await executor.execute(request);

        // Then
        expect(result).toEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: 'response without content-type'
        });
    });

    test('should return response without throwing when status indicates error', async () => {
        // Given
        const fetchMock = spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/resource',
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
        expect(result).toEqual({
            status: 404,
            statusText: 'Not Found',
            url: 'http://example.com/resource',
            body: { error: 'not found' }
        });
    });

    test('should throw abort error when fetch is aborted', async () => {
        // Given
        const fetchMock = spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/resource',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenReject(new DOMException('The operation was aborted.', 'AbortError'));
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([]));

        // When, Then
        await expect(executor.execute(request))
            .rejects.toThrowError(new HttpAbortError({ url: 'http://example.com/resource' }));
    });

    test('should throw network error when fetch fails with an exception', async () => {
        // Given
        const fetchMock = spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/resource',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenReject(new Error('Network failure'));
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([]));

        // When, Then
        await expect(executor.execute(request))
            .rejects.toThrowError(new HttpNetworkError({
                url: 'http://example.com/resource',
                description: 'Network failure'
            }));
    });

    test('should throw network error when fetch fails with a primitive value', async () => {
        // Given
        const fetchMock = spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/resource',
            method: HttpMethod.Get,
            signal: new AbortController().signal
        };
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenReject('Network unreachable');
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([]));

        // When, Then
        await expect(executor.execute(request))
            .rejects.toThrowError(new HttpNetworkError({
                url: 'http://example.com/resource',
                description: 'Network unreachable'
            }));
    });

    test('should throw payload error when JSON parsing fails', async () => {
        // Given
        const fetchMock = spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/resource',
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
        await expect(executor.execute(request))
            .rejects.toThrowError(new HttpPayloadError({ url: 'http://example.com/resource' }));
    });

    test('should throw payload error when text parsing fails', async () => {
        // Given
        const fetchMock = spyOn(globalThis, 'fetch');
        const request: HttpRequest = {
            url: 'http://example.com/resource',
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
        spyOn(responseStub, 'text').mockRejectedValue(new TypeError('Failed to read body'));
        when(fetchMock)
            .calledWith(request.url, { method: request.method, signal: request.signal })
            .thenResolve(responseStub);
        const executor = new FetchHttpRequestExecutor(new ResponseBodyParserResolver([new TextResponseBodyParser()]));

        // When, Then
        await expect(executor.execute(request))
            .rejects.toThrowError(new HttpPayloadError({ url: 'http://example.com/resource' }));
    });
});
