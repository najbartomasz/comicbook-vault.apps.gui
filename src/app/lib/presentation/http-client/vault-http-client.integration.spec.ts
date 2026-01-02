import { TestBed } from '@angular/core/testing';

import { injectVaultHttpClient } from './vault-http-client.inject';

describe(injectVaultHttpClient, () => {
    const createResponseStub = (url: string, body: BodyInit, init: ResponseInit): Response => {
        const responseStub = new Response(body, init);
        Object.defineProperty(responseStub, 'url', { value: url });
        return responseStub;
    };

    test('should send GET request, receive expected response and log to console', async () => {
        // Given
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            createResponseStub(
                'http://localhost:3000/vault/comics/42',
                JSON.stringify({ id: 42, title: 'Test Comic' }),
                {
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                }
            )
        ));
        const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        const httpClient = TestBed.runInInjectionContext(() => injectVaultHttpClient());

        // When
        const response = await httpClient.get('/comics/42');

        // Then
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({ id: 42, title: 'Test Comic' });
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            1,
            '[HTTP Request]',
            {
                url: 'http://localhost:3000/vault/comics/42',
                method: 'GET',
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            2,
            '[HTTP Response]',
            {
                url: 'http://localhost:3000/vault/comics/42',
                status: 200,
                statusText: 'OK',
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });

    test('should send GET request and handle HTTP error response', async () => {
        // Given
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            createResponseStub(
                'http://localhost:3000/vault/comics/999',
                'Not Found',
                {
                    status: 404,
                    statusText: 'Not Found',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                }
            )
        ));
        const consoleErrorSpy = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        const httpClient = TestBed.runInInjectionContext(() => injectVaultHttpClient());

        // When
        const response = await httpClient.get('/comics/999');

        // Then
        expect(response.status).toBe(404);
        expect(response.body).toBe('Not Found');
        expect(consoleErrorSpy).toHaveBeenNthCalledWith(
            1,
            '[HTTP Request]',
            {
                url: 'http://localhost:3000/vault/comics/999',
                method: 'GET',
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleErrorSpy).toHaveBeenNthCalledWith(
            2,
            '[HTTP Response]',
            {
                url: 'http://localhost:3000/vault/comics/999',
                status: 404,
                statusText: 'Not Found',
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });

    test('should send multiple requests and increment sequence number accordingly', async () => {
        // Given
        vi.stubGlobal('fetch', vi.fn<typeof fetch>()
            .mockResolvedValueOnce(
                createResponseStub(
                    'http://localhost:3000/vault/comics/1',
                    'Comic 1',
                    {
                        status: 200,
                        statusText: 'OK',
                        headers: new Headers({ 'Content-Type': 'text/plain' })
                    }
                )
            )
            .mockResolvedValueOnce(
                createResponseStub(
                    'http://localhost:3000/vault/comics/2',
                    'Comic 2',
                    {
                        status: 200,
                        statusText: 'OK',
                        headers: new Headers({ 'Content-Type': 'text/plain' })
                    }
                )
            ));
        const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        const httpClient = TestBed.runInInjectionContext(() => injectVaultHttpClient());

        // When
        await httpClient.get('/comics/1');
        await httpClient.get('/comics/2');

        // Then
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            1,
            '[HTTP Request]',
            {
                url: 'http://localhost:3000/vault/comics/1',
                method: 'GET',
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            2,
            '[HTTP Response]',
            {
                url: 'http://localhost:3000/vault/comics/1',
                status: 200,
                statusText: 'OK',
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            3,
            '[HTTP Request]',
            {
                url: 'http://localhost:3000/vault/comics/2',
                method: 'GET',
                sequenceNumber: 2,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            4,
            '[HTTP Response]',
            {
                url: 'http://localhost:3000/vault/comics/2',
                status: 200,
                statusText: 'OK',
                sequenceNumber: 2,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });

    test(`should send multiple requests and maintain correct sequence numbers
          when subsequent request is sent before the previous one completes`, async () => {
        // Given
        const firstRequest = Promise.withResolvers<Response>();
        vi.stubGlobal('fetch', vi.fn<typeof fetch>()
            .mockReturnValueOnce(firstRequest.promise)
            .mockResolvedValueOnce(
                createResponseStub(
                    'http://localhost:3000/vault/comics/2',
                    'Comic 2',
                    {
                        status: 200,
                        statusText: 'OK',
                        headers: new Headers({ 'Content-Type': 'text/plain' })
                    }
                )
            ));
        const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        const httpClient = TestBed.runInInjectionContext(() => injectVaultHttpClient());

        // When
        const deferredFirstRequestResponse = httpClient.get('/comics/1');
        const secondRequestResponse = await httpClient.get('/comics/2');
        firstRequest.resolve(
            createResponseStub(
                'http://localhost:3000/vault/comics/1',
                'Comic 1',
                {
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                }
            )
        );
        const firstRequestResponse = await deferredFirstRequestResponse;

        // Then
        expect(firstRequestResponse.status).toBe(200);
        expect(firstRequestResponse.body).toBe('Comic 1');
        expect(secondRequestResponse.status).toBe(200);
        expect(secondRequestResponse.body).toBe('Comic 2');
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            1,
            '[HTTP Request]',
            {
                url: 'http://localhost:3000/vault/comics/1',
                method: 'GET',
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            2,
            '[HTTP Request]',
            {
                url: 'http://localhost:3000/vault/comics/2',
                method: 'GET',
                sequenceNumber: 2,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            3,
            '[HTTP Response]',
            {
                url: 'http://localhost:3000/vault/comics/2',
                status: 200,
                statusText: 'OK',
                sequenceNumber: 2,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(
            4,
            '[HTTP Response]',
            {
                url: 'http://localhost:3000/vault/comics/1',
                status: 200,
                statusText: 'OK',
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });
});
