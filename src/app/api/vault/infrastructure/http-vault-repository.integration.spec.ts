import { stubResponse } from '@testing/unit/http';

import { HttpVaultRepository } from './http-vault-repository';
import { createVaultRepository } from './vault-repository.factory';

describe(HttpVaultRepository, () => {
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
        const vaultApiClient = createVaultRepository('https://localhost:3000/vault');

        // When
        const response = await vaultApiClient.get<{ id: number; title: string }>('/comics/42');

        // Then
        expect(response).toStrictEqual({ id: 42, title: 'Test Comic' });
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
        const vaultApiClient = createVaultRepository('https://localhost:3000/vault');

        // When
        const response = await vaultApiClient.get('/comics/999');

        // Then
        expect(response).toBe('Not Found');
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
        const vaultApiClient = createVaultRepository('https://localhost:3000/vault');

        // When
        await vaultApiClient.get('/comics/1');
        await vaultApiClient.get('/comics/2');

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
        const vaultApiClient = createVaultRepository('https://localhost:3000/vault');

        // When
        const firstPromise = vaultApiClient.get<string>('/comics/1');
        const secondResponse = await vaultApiClient.get<string>('/comics/2');
        firstRequest.resolve(
            stubResponse({
                url: 'https://localhost:3000/vault/comics/1',
                body: 'Comic 1',
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        );
        const firstResponse = await firstPromise;

        // Then
        expect(firstResponse).toBe('Comic 1');
        expect(secondResponse).toBe('Comic 2');
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
