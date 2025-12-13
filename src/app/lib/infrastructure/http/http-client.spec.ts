import { describe, expect, fn, test, when } from '@testing/unit';

import { HttpNetworkError } from './error/http-network-error';
import { HttpStatusError } from './error/http-status-error';
import { HttpClient } from './http-client';

describe(HttpClient, () => {
    test('should return parsed body when GET request succeeds with 2xx status', async () => {
        // Given
        const executeMock = fn();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource', method: 'GET' })
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
        expect(result).toEqual({ data: 'test' });
    });

    test('should throw error when executor rejects with network failure', async () => {
        // Given
        const executeMock = fn();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource', method: 'GET' })
            .thenReject(new HttpNetworkError({ url: 'http://example.com/resource', description: 'Network failure' }));
        const httpClient = new HttpClient('http://example.com', { execute: executeMock });

        // When, Then
        await expect(httpClient.get('/resource'))
            .rejects.toThrowError(new HttpNetworkError({
                url: 'http://example.com/resource',
                description: 'Network failure'
            }));
    });

    test('should throw status error when response status indicates failure', async () => {
        // Given
        const executeMock = fn();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource', method: 'GET' })
            .thenResolve({
                status: 404,
                statusText: 'Not Found',
                url: 'http://example.com/resource',
                body: { message: 'not found' }
            });
        const httpClient = new HttpClient('http://example.com', { execute: executeMock });

        // When, Then
        await expect(httpClient.get('/resource'))
            .rejects.toThrowError(new HttpStatusError({
                status: 404,
                statusText: 'Not Found',
                url: 'http://example.com/resource',
                body: { message: 'not found' }
            }));
    });

    test('should pass abort signal to executor when provided', async () => {
        // Given
        const abortController = new AbortController();
        const executeMock = fn();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource', method: 'GET', signal: abortController.signal })
            .thenResolve({
                status: 200,
                statusText: 'OK',
                url: 'http://example.com/resource',
                body: { data: 'test' }
            });
        const httpClient = new HttpClient('http://example.com', { execute: executeMock });

        // When
        const result = await httpClient.get('/resource', { abortSignal: abortController.signal });

        // Then
        expect(result).toEqual({ data: 'test' });
        expect(executeMock).toHaveBeenCalledWith({
            url: 'http://example.com/resource',
            method: 'GET',
            signal: abortController.signal
        });
    });

    test('should not pass signal to executor when abort signal not provided', async () => {
        // Given
        const executeMock = fn();
        when(executeMock)
            .calledWith({ url: 'http://example.com/resource', method: 'GET' })
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
        expect(result).toEqual({ data: 'test' });
        expect(executeMock).toHaveBeenCalledWith({
            url: 'http://example.com/resource',
            method: 'GET'
        });
    });
});
