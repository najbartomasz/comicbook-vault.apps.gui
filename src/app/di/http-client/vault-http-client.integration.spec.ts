import { type Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { USER_CONFIG_TOKEN } from '@di/user-config/injection-tokens';
import { HttpUrl } from '@lib/http-client/domain';
import { stubResponse } from '@testing/unit/http';

import { injectVaultHttpClient } from './inject-functions/vault-http-client.inject-function';
import { provideVaultHttpClient } from './providers/vault-http-client.provider';

describe(injectVaultHttpClient, () => {
    const setup = (options: { providers: Provider[] }) => {
        TestBed.configureTestingModule({
            providers: [
                provideVaultHttpClient(),
                ...options.providers
            ]
        });
        return TestBed.runInInjectionContext(() => injectVaultHttpClient());
    };

    test('should send request, receive expected response and log to console', async () => {
        // Given
        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://localhost:3000/vault/comics/42',
                body: { id: 42, title: 'Test Comic' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));

        const vaultHttpClient = setup({
            providers: [
                {
                    provide: USER_CONFIG_TOKEN,
                    useValue: { vaultApiUrl: HttpUrl.create('https://localhost:3000/vault') }
                }
            ]
        });

        // When
        const response = await vaultHttpClient.get('/comics/42');

        // Then
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({ id: 42, title: 'Test Comic' });
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            1,
            '[HTTP Request] GET https://localhost:3000/vault/comics/42',
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            '[HTTP Response] GET https://localhost:3000/vault/comics/42 200',
            {
                body: { id: 42, title: 'Test Comic' },
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });

    test('should send request and handle HTTP error response', async () => {
        // Given
        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://localhost:3000/vault/comics/999',
                body: 'Not Found',
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        ));
        const vaultHttpClient = setup({
            providers: [
                {
                    provide: USER_CONFIG_TOKEN,
                    useValue: { vaultApiUrl: HttpUrl.create('https://localhost:3000/vault') }
                }
            ]
        });

        // When
        const response = await vaultHttpClient.get('/comics/999');

        // Then
        expect(response.status).toBe(404);
        expect(response.body).toBe('Not Found');
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            1,
            '[HTTP Request] GET https://localhost:3000/vault/comics/999',
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            '[HTTP Response] GET https://localhost:3000/vault/comics/999 404',
            {
                body: 'Not Found',
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
                    url: 'https://localhost:3000/vault/comics/1',
                    body: 'Comic 1',
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                })
            )
            .mockResolvedValueOnce(
                stubResponse({
                    url: 'https://localhost:3000/vault/comics/2',
                    body: 'Comic 2',
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                })
            ));
        const vaultHttpClient = setup({
            providers: [
                {
                    provide: USER_CONFIG_TOKEN,
                    useValue: { vaultApiUrl: HttpUrl.create('https://localhost:3000/vault') }
                }
            ]
        });

        // When
        await vaultHttpClient.get('/comics/1');
        await vaultHttpClient.get('/comics/2');

        // Then
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            1,
            '[HTTP Request] GET https://localhost:3000/vault/comics/1',
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            '[HTTP Response] GET https://localhost:3000/vault/comics/1 200',
            {
                body: 'Comic 1',
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            3,
            '[HTTP Request] GET https://localhost:3000/vault/comics/2',
            {
                sequenceNumber: 2,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            4,
            '[HTTP Response] GET https://localhost:3000/vault/comics/2 200',
            {
                body: 'Comic 2',
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
                    url: 'https://localhost:3000/vault/comics/2',
                    body: 'Comic 2',
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                })
            ));
        const vaultHttpClient = setup({
            providers: [
                {
                    provide: USER_CONFIG_TOKEN,
                    useValue: { vaultApiUrl: HttpUrl.create('https://localhost:3000/vault') }
                }
            ]
        });

        // When
        const deferredFirstRequestResponse = vaultHttpClient.get('/comics/1');
        const secondRequestResponse = await vaultHttpClient.get('/comics/2');
        firstRequest.resolve(
            stubResponse({
                url: 'https://localhost:3000/vault/comics/1',
                body: 'Comic 1',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        );
        const firstRequestResponse = await deferredFirstRequestResponse;

        // Then
        expect(firstRequestResponse.status).toBe(200);
        expect(firstRequestResponse.body).toBe('Comic 1');
        expect(secondRequestResponse.status).toBe(200);
        expect(secondRequestResponse.body).toBe('Comic 2');
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            1,
            '[HTTP Request] GET https://localhost:3000/vault/comics/1',
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            '[HTTP Request] GET https://localhost:3000/vault/comics/2',
            {
                sequenceNumber: 2,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            3,
            '[HTTP Response] GET https://localhost:3000/vault/comics/2 200',
            {
                body: 'Comic 2',
                sequenceNumber: 2,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            4,
            '[HTTP Response] GET https://localhost:3000/vault/comics/1 200',
            {
                body: 'Comic 1',
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });
});
