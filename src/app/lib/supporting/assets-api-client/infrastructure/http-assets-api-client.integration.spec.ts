import { EndpointPath } from '@lib/generic/endpoint/domain';
import { stubResponse } from '@testing/unit/http';

import { createAssetsApiClient } from './assets-api-client.factory';
import { HttpAssetsApiClient } from './http-assets-api-client';

describe(HttpAssetsApiClient, () => {
    test('should send request, receive expected response and log to console', async () => {
        // Given
        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: `${globalThis.location.origin}/config.json`,
                body: { message: 'Hello, World!' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        const assetsApiClient = createAssetsApiClient(globalThis.location.origin);

        // When
        const response = await assetsApiClient.get<{ message: string }>(EndpointPath.create('/config.json'));

        // Then
        expect(response).toStrictEqual({ message: 'Hello, World!' });
        expect(consoleInfoMock).toHaveBeenCalledWith(
            `[HTTP Request] GET ${globalThis.location.origin}/config.json`,
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            `[HTTP Response] GET ${globalThis.location.origin}/config.json 200`,
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
                url: `${globalThis.location.origin}/missing.json`,
                body: 'Not Found',
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        ));
        const assetsApiClient = createAssetsApiClient(globalThis.location.origin);

        // When
        const response = await assetsApiClient.get(EndpointPath.create('/missing.json'));

        // Then
        expect(response).toBe('Not Found');
        expect(consoleInfoMock).toHaveBeenCalledWith(
            `[HTTP Request] GET ${globalThis.location.origin}/missing.json`,
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            `[HTTP Response] GET ${globalThis.location.origin}/missing.json 404`,
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
                    url: `${globalThis.location.origin}/first.json`,
                    body: { data: 'first' },
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
            )
            .mockResolvedValueOnce(
                stubResponse({
                    url: `${globalThis.location.origin}/second.json`,
                    body: { data: 'second' },
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'application/json' })
                })
            ));
        const assetsApiClient = createAssetsApiClient(globalThis.location.origin);

        // When
        await assetsApiClient.get(EndpointPath.create('/first.json'));
        await assetsApiClient.get(EndpointPath.create('/second.json'));

        // Then
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            1,
            `[HTTP Request] GET ${globalThis.location.origin}/first.json`,
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            `[HTTP Response] GET ${globalThis.location.origin}/first.json 200`,
            {
                body: { data: 'first' },
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            3,
            `[HTTP Request] GET ${globalThis.location.origin}/second.json`,
            {
                sequenceNumber: 2,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            4,
            `[HTTP Response] GET ${globalThis.location.origin}/second.json 200`,
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
                    url: `${globalThis.location.origin}/comic2.txt`,
                    body: 'Comic 2',
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                })
            ));
        const assetsApiClient = createAssetsApiClient(globalThis.location.origin);

        // When
        const firstPromise = assetsApiClient.get(EndpointPath.create('/comic1.txt'));
        const secondResponse = await assetsApiClient.get(EndpointPath.create('/comic2.txt'));
        firstRequest.resolve(
            stubResponse({
                url: `${globalThis.location.origin}/comic1.txt`,
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
            `[HTTP Request] GET ${globalThis.location.origin}/comic1.txt`,
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            `[HTTP Request] GET ${globalThis.location.origin}/comic2.txt`,
            {
                sequenceNumber: 2,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            3,
            `[HTTP Response] GET ${globalThis.location.origin}/comic2.txt 200`,
            {
                body: 'Comic 2',
                sequenceNumber: 2,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            4,
            `[HTTP Response] GET ${globalThis.location.origin}/comic1.txt 200`,
            {
                body: 'Comic 1',
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });
});
