import { when } from 'vitest-when';

import { HttpNetworkError } from './error/http-network-error';
import { type HttpRequestExecutor } from './executor';
import { FetchHttpClient } from './fetch-http-client';
import { type HttpRequestInterceptor } from './interceptor/http-request-interceptor.interface';
import { type HttpResponseInterceptor } from './interceptor/http-response-interceptor.interface';
import { HttpMethod } from './method';

describe(FetchHttpClient, () => {
    test('should return HTTP response when GET request succeeds', async () => {
        // Given
        const executeMock = vi.fn<HttpRequestExecutor['execute']>();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource', method: HttpMethod.Get })
            .thenResolve({
                status: 200,
                statusText: 'OK',
                url: 'http://example.com/resource',
                body: { data: 'test' }
            });
        const httpClient = new FetchHttpClient('http://example.com', { execute: executeMock });

        // When
        const result = await httpClient.get('/resource');

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: { data: 'test' }
        });
    });

    test('should re-throw error when executor rejects', async () => {
        // Given
        const executeMock = vi.fn<HttpRequestExecutor['execute']>();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource', method: HttpMethod.Get })
            .thenReject(new HttpNetworkError({ url: 'http://example.com/resource', description: 'Network failure' }));
        const httpClient = new FetchHttpClient('http://example.com', { execute: executeMock });

        // When, Then
        await expect(httpClient.get('/resource'))
            .rejects.toThrow(new HttpNetworkError({
                url: 'http://example.com/resource',
                description: 'Network failure'
            }));
    });

    test('should pass abort signal to executor when provided', async () => {
        // Given
        const abortController = new AbortController();
        const executeMock = vi.fn<HttpRequestExecutor['execute']>();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource', method: HttpMethod.Get, signal: abortController.signal })
            .thenResolve({
                status: 200,
                statusText: 'OK',
                url: 'http://example.com/resource',
                body: { data: 'test' }
            });
        const httpClient = new FetchHttpClient('http://example.com', { execute: executeMock });

        // When
        await httpClient.get('/resource', { abortSignal: abortController.signal });

        // Then
        expect(executeMock).toHaveBeenCalledExactlyOnceWith({
            url: 'http://example.com/resource',
            method: 'GET',
            signal: abortController.signal
        });
    });

    test('should not pass signal to executor when abort signal not provided', async () => {
        // Given
        const executeMock = vi.fn<HttpRequestExecutor['execute']>();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource', method: HttpMethod.Get })
            .thenResolve({
                status: 200,
                statusText: 'OK',
                url: 'http://example.com/resource',
                body: { data: 'test' }
            });
        const httpClient = new FetchHttpClient('http://example.com', { execute: executeMock });

        // When
        await httpClient.get('/resource');

        // Then
        expect(executeMock).toHaveBeenCalledExactlyOnceWith({
            url: 'http://example.com/resource',
            method: 'GET'
        });
    });

    test('should execute request interceptors in order', async () => {
        // Given
        const executeMock = vi.fn<HttpRequestExecutor['execute']>();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource?param1=value1&param2=value2', method: HttpMethod.Get })
            .thenResolve({
                status: 200,
                statusText: 'OK',
                url: 'http://example.com/resource',
                body: { data: 'test' }
            });
        const interceptRequest1Mock = vi.fn<HttpRequestInterceptor['interceptRequest']>((request) => ({
            ...request,
            url: `${request.url}?param1=value1`
        }));
        const interceptRequest2Mock = vi.fn<HttpRequestInterceptor['interceptRequest']>((request) => ({
            ...request,
            url: `${request.url}&param2=value2`
        }));
        const httpClient = new FetchHttpClient(
            'http://example.com',
            { execute: executeMock },
            [{ interceptRequest: interceptRequest1Mock }, { interceptRequest: interceptRequest2Mock }]
        );

        // When
        await httpClient.get('/resource');

        // Then
        expect(interceptRequest1Mock).toHaveBeenCalledExactlyOnceWith({
            url: 'http://example.com/resource', method: HttpMethod.Get
        });
        expect(interceptRequest2Mock).toHaveBeenCalledExactlyOnceWith({
            url: 'http://example.com/resource?param1=value1', method: HttpMethod.Get
        });
        expect(interceptRequest1Mock).toHaveBeenCalledBefore(interceptRequest2Mock);
        expect(executeMock).toHaveBeenCalledExactlyOnceWith({
            url: 'http://example.com/resource?param1=value1&param2=value2', method: HttpMethod.Get
        });
    });

    test('should execute response interceptors in order', async () => {
        const executeMock = vi.fn<HttpRequestExecutor['execute']>().mockResolvedValueOnce({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: { data: 'test' }
        });
        const interceptResponse1Mock = vi.fn<HttpResponseInterceptor['interceptResponse']>((response) => ({
            ...response,
            body: { ...response.body as object, interceptor1: 'applied' }
        }));
        const interceptResponse2Mock = vi.fn<HttpResponseInterceptor['interceptResponse']>((response) => ({
            ...response,
            body: { ...response.body as object, interceptor2: 'applied' }
        }));
        const httpClient = new FetchHttpClient(
            'http://example.com',
            { execute: executeMock },
            [{ interceptResponse: interceptResponse1Mock }, { interceptResponse: interceptResponse2Mock }]
        );

        // When
        const result = await httpClient.get('/resource');

        // Then
        expect(interceptResponse1Mock).toHaveBeenCalledExactlyOnceWith(
            {
                status: 200,
                statusText: 'OK',
                url: 'http://example.com/resource',
                body: { data: 'test' }
            },
            {
                url: 'http://example.com/resource',
                method: HttpMethod.Get
            }
        );
        expect(interceptResponse2Mock).toHaveBeenCalledExactlyOnceWith(
            {
                status: 200,
                statusText: 'OK',
                url: 'http://example.com/resource',
                body: { data: 'test', interceptor1: 'applied' }
            },
            {
                url: 'http://example.com/resource',
                method: HttpMethod.Get
            }
        );
        expect(interceptResponse1Mock).toHaveBeenCalledBefore(interceptResponse2Mock);
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: { data: 'test', interceptor1: 'applied', interceptor2: 'applied' }
        });
    });
});
