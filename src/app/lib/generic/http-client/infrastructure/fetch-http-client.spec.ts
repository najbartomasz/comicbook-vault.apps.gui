import { stubResponse } from '@testing/unit/http';

import { type HttpInterceptor } from '../application';
import { HttpMethod, HttpPath, HttpUrl } from '../domain';

import { JsonResponseBodyParser } from './body-parsers/json/json.response-body-parser';
import { HttpNetworkError } from './errors/network/http-network-error';
import { FetchHttpClient } from './fetch-http-client';
import { type HttpRequestExecutor } from './request-executor/http-request-executor.interface';

describe(FetchHttpClient, () => {
    test('should return HTTP response when GET request succeeds', async () => {
        // Given
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: { data: 'test' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const fetchHttpClient = new FetchHttpClient(HttpUrl.create('https://example.com'), [new JsonResponseBodyParser()]);

        // When
        const result = await fetchHttpClient.get(HttpPath.create('/api'));

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'https://example.com/api',
            body: { data: 'test' }
        });
    });

    test('should re-throw error when executor rejects', async () => {
        // Given
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValueOnce(
            new Error('Network failure')
        ));
        const fetchHttpClient = new FetchHttpClient(HttpUrl.create('https://example.com'), [new JsonResponseBodyParser()]);

        // When, Then
        await expect(fetchHttpClient.get(HttpPath.create('/api'))).rejects.toThrowError(
            new HttpNetworkError({
                url: 'https://example.com/api',
                description: 'Network failure'
            })
        );
    });

    test('should pass abort signal to executor when provided', async () => {
        // Given
        const abortController = new AbortController();
        const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: { data: 'test' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        );
        vi.stubGlobal('fetch', fetchMock);
        const fetchHttpClient = new FetchHttpClient(HttpUrl.create('https://example.com'), [new JsonResponseBodyParser()]);

        // When
        await fetchHttpClient.get(HttpPath.create('/api'), { abortSignal: abortController.signal });

        // Then
        expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
            'https://example.com/api',
            {
                method: HttpMethod.Get,
                signal: abortController.signal
            }
        );
    });

    test('should not pass signal to executor when abort signal not provided', async () => {
        // Given
        const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: { data: 'test' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        );
        vi.stubGlobal('fetch', fetchMock);
        const fetchHttpClient = new FetchHttpClient(HttpUrl.create('https://example.com'), [new JsonResponseBodyParser()]);

        // When
        await fetchHttpClient.get(HttpPath.create('/api'));

        // Then
        expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
            'https://example.com/api',
            {
                method: HttpMethod.Get
            }
        );
    });

    test('should execute interceptors in order', async () => {
        // Given
        const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api?param1=value1&param2=value2',
                body: { data: 'test' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        );
        vi.stubGlobal('fetch', fetchMock);
        const intercept1Mock = vi.fn<HttpInterceptor['intercept']>()
            .mockImplementationOnce(async (request, next) => {
                const modifiedRequest = { ...request, url: `${request.url}?param1=value1` };
                return next(modifiedRequest);
            });
        const intercept2Mock = vi.fn<HttpInterceptor['intercept']>()
            .mockImplementationOnce(async (request, next) => {
                const modifiedRequest = { ...request, url: `${request.url}&param2=value2` };
                return next(modifiedRequest);
            });
        const fetchHttpClient = new FetchHttpClient(
            HttpUrl.create('https://example.com'),
            [new JsonResponseBodyParser()],
            [{ intercept: intercept1Mock }, { intercept: intercept2Mock }]
        );

        // When
        await fetchHttpClient.get(HttpPath.create('/api'));

        // Then
        expect(intercept1Mock).toHaveBeenCalledExactlyOnceWith(
            expect.objectContaining({
                url: 'https://example.com/api',
                method: HttpMethod.Get
            }),
            expect.any(Function)
        );
        expect(intercept2Mock).toHaveBeenCalledExactlyOnceWith(
            expect.objectContaining({
                url: 'https://example.com/api?param1=value1',
                method: HttpMethod.Get
            }),
            expect.any(Function)
        );
        expect(intercept1Mock).toHaveBeenCalledBefore(intercept2Mock);
        expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
            'https://example.com/api?param1=value1&param2=value2',
            {
                method: HttpMethod.Get
            }
        );
    });

    test('should execute response handling in interceptors', async () => {
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://example.com/api',
                body: { data: 'test' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const intercept1Mock = vi.fn<HttpInterceptor['intercept']>()
            .mockImplementationOnce(async (request, next) => {
                const response = await next(request);
                return {
                    ...response,
                    body: { ...response.body as object, interceptor2: 'applied' }
                };
            });
        const intercept2Mock = vi.fn<HttpInterceptor['intercept']>()
            .mockImplementationOnce(async (request, next) => {
                const response = await next(request);
                return {
                    ...response,
                    body: { ...response.body as object, interceptor1: 'applied' }
                };
            });
        const fetchHttpClient = new FetchHttpClient(
            HttpUrl.create('https://example.com'),
            [new JsonResponseBodyParser()],
            [{ intercept: intercept1Mock }, { intercept: intercept2Mock }]
        );

        // When
        const result = await fetchHttpClient.get(HttpPath.create('/api'));

        // Then
        expect(intercept1Mock).toHaveBeenCalledExactlyOnceWith(
            expect.objectContaining({
                url: 'https://example.com/api',
                method: HttpMethod.Get
            }),
            expect.any(Function)
        );
        expect(intercept2Mock).toHaveBeenCalledExactlyOnceWith(
            expect.objectContaining({
                url: 'https://example.com/api',
                method: HttpMethod.Get
            }),
            expect.any(Function)
        );
        expect(intercept1Mock).toHaveBeenCalledBefore(intercept2Mock);
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'https://example.com/api',
            body: { data: 'test', interceptor2: 'applied', interceptor1: 'applied' }
        });
    });

    test('should use custom request executor when provided', async () => {
        // Given
        const customExecutorMock = vi.fn<HttpRequestExecutor['execute']>().mockResolvedValueOnce({
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { custom: 'executor response' }
        });
        const customExecutor: HttpRequestExecutor = {
            execute: customExecutorMock
        };
        const fetchHttpClient = new FetchHttpClient(
            HttpUrl.create('https://example.com'),
            [new JsonResponseBodyParser()],
            [],
            customExecutor
        );

        // When
        const result = await fetchHttpClient.get(HttpPath.create('/api'));

        // Then
        expect(customExecutorMock).toHaveBeenCalledExactlyOnceWith({
            url: 'https://example.com/api',
            method: HttpMethod.Get
        });
        expect(result).toStrictEqual({
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { custom: 'executor response' }
        });
    });
});
