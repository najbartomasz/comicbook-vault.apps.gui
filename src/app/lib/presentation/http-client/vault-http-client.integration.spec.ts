import { TestBed } from '@angular/core/testing';
import { when } from 'vitest-when';

import { injectVaultHttpClient } from './vault-http-client.inject';

describe(injectVaultHttpClient, () => {
    const createResponseStub = (url: string, body: BodyInit, init: ResponseInit): Response => {
        const responseStub = new Response(body, init);
        Object.defineProperty(responseStub, 'url', { value: url });
        return responseStub;
    };

    test('should send GET request, receive expected response and log to console', async () => {
        // Given
        const fetchMock = vi.spyOn(globalThis, 'fetch');
        when(fetchMock)
            .calledWith('http://localhost:3000/vault/comics/42', { method: 'GET' })
            .thenResolve(createResponseStub(
                'http://localhost:3000/vault/comics/42',
                JSON.stringify({ id: 42, title: 'Test Comic' }),
                {
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                }
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
                timestamp: expect.any(Number),
                highResolutionTimestamp: expect.any(Number)
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
});
