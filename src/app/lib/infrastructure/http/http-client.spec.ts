import { when } from 'vitest-when';

import { HttpNetworkError } from './error/http-network-error';
import { type HttpRequestExecutor } from './executor';
import { HttpClient } from './http-client';
import { HttpMethod } from './method';

describe(HttpClient, () => {
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
        const httpClient = new HttpClient('http://example.com', { execute: executeMock });

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
        const httpClient = new HttpClient('http://example.com', { execute: executeMock });

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
        const httpClient = new HttpClient('http://example.com', { execute: executeMock });

        // When
        await httpClient.get('/resource', { abortSignal: abortController.signal });

        // Then
        expect(executeMock).toHaveBeenCalledWith({
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
        const httpClient = new HttpClient('http://example.com', { execute: executeMock });

        // When
        await httpClient.get('/resource');

        // Then
        expect(executeMock).toHaveBeenCalledWith({
            url: 'http://example.com/resource',
            method: 'GET'
        });
    });
});
