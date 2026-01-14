import { PLATFORM_ID, type Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { stubResponse } from '@testing/unit/http';

import { injectAssetsHttpClient } from './inject-functions/assets-http-client.inject-function';
import { provideAssetsHttpClient } from './providers';

describe(injectAssetsHttpClient, () => {
    const setup = (options: { providers: Provider[] }) => {
        TestBed.configureTestingModule({
            providers: [
                provideAssetsHttpClient(),
                ...options.providers
            ]
        });
        return TestBed.runInInjectionContext(() => injectAssetsHttpClient());
    };

    test('should send request, receive expected response and log to console', async () => {
        // Given
        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://app.com/assets/config.json',
                body: { message: 'Hello, World!' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const assetsHttpClient = setup({
            providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
        });

        // When
        const response = await assetsHttpClient.get('/assets/config.json');

        // Then
        expect(response).toStrictEqual({
            url: expect.stringContaining('/assets/config.json'),
            status: 200,
            statusText: 'OK',
            metadata: {
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            },
            body: { message: 'Hello, World!' }
        });
        expect(consoleInfoMock).toHaveBeenCalledWith(
            `[HTTP Request] GET ${globalThis.location.origin}/assets/config.json`,
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            `[HTTP Response] GET ${globalThis.location.origin}/assets/config.json 200`,
            {
                body: { message: 'Hello, World!' },
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });

    test('should send request and handle error response', async () => {
        // Given
        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://app.com/assets/missing.json',
                body: { error: 'Not Found' },
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const assetsHttpClient = setup({
            providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
        });

        // When
        const response = await assetsHttpClient.get('/assets/missing.json');

        // Then
        expect(response).toStrictEqual({
            url: expect.stringContaining('/assets/missing.json'),
            status: 404,
            statusText: 'Not Found',
            metadata: {
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            },
            body: { error: 'Not Found' }
        });
        expect(consoleInfoMock).toHaveBeenCalledWith(
            `[HTTP Request] GET ${globalThis.location.origin}/assets/missing.json`,
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            `[HTTP Response] GET ${globalThis.location.origin}/assets/missing.json 404`,
            {
                body: { error: 'Not Found' },
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });

    test('should send multiple requests and increment sequence number accordingly', async () => {
        // Given
        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        vi.stubGlobal('fetch', vi.fn<typeof fetch>()
            .mockResolvedValueOnce(
                stubResponse({
                    url: 'https://app.com/assets/first.json',
                    body: { data: 'first' },
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
            )
            .mockResolvedValueOnce(
                stubResponse({
                    url: 'https://app.com/assets/second.json',
                    body: { data: 'second' },
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
            ));
        const assetsHttpClient = setup({
            providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
        });

        // When
        await assetsHttpClient.get('/assets/first.json');
        await assetsHttpClient.get('/assets/second.json');

        // Then
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            1,
            `[HTTP Request] GET ${globalThis.location.origin}/assets/first.json`,
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            `[HTTP Response] GET ${globalThis.location.origin}/assets/first.json 200`,
            {
                body: { data: 'first' },
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            3,
            `[HTTP Request] GET ${globalThis.location.origin}/assets/second.json`,
            {
                sequenceNumber: 2,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            4,
            `[HTTP Response] GET ${globalThis.location.origin}/assets/second.json 200`,
            {
                body: { data: 'second' },
                sequenceNumber: 2,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });

    test(`should send multiple requests and maintain correct sequence numbers
          when subsequent request is sent before the previous one completes`, async () => {
        // Given
        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        const firstRequest = Promise.withResolvers<Response>();
        vi.stubGlobal('fetch', vi.fn<typeof fetch>()
            .mockReturnValueOnce(firstRequest.promise)
            .mockResolvedValueOnce(
                stubResponse({
                    url: 'https://app.com/assets/comic2.txt',
                    body: 'Comic 2',
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                })
            ));
        const assetsHttpClient = setup({
            providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
        });

        // When
        const firstPromise = assetsHttpClient.get('/assets/comic1.txt');
        const secondResponse = await assetsHttpClient.get('/assets/comic2.txt');
        firstRequest.resolve(
            stubResponse({
                url: 'https://app.com/assets/comic1.txt',
                body: 'Comic 1',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        );
        await firstPromise;

        // Then
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            1,
            `[HTTP Request] GET ${globalThis.location.origin}/assets/comic1.txt`,
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            `[HTTP Request] GET ${globalThis.location.origin}/assets/comic2.txt`,
            {
                sequenceNumber: 2,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            3,
            `[HTTP Response] GET ${globalThis.location.origin}/assets/comic2.txt 200`,
            {
                body: 'Comic 2',
                sequenceNumber: 2,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            4,
            `[HTTP Response] GET ${globalThis.location.origin}/assets/comic1.txt 200`,
            {
                body: 'Comic 1',
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
        expect(secondResponse).toStrictEqual({
            url: expect.stringContaining('/assets/comic2.txt'),
            status: 200,
            statusText: 'OK',
            metadata: {
                sequenceNumber: 2,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            },
            body: 'Comic 2'
        });
    });

    test('should throw error when injected on server platform', () => {
        // Given, When, Then
        expect(() => {
            setup({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
        }).toThrowError('AssetsHttpClient is not available on server. Use direct file system access instead.');
    });
});
