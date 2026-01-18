import { type HttpClient } from '@lib/http-client/domain';

import { AssetsApiClient } from './assets-api-client';

describe(AssetsApiClient, () => {
    test('should get data from the specified path without abort signal', async () => {
        // Given
        const getMock = vi.fn<HttpClient['get']>().mockResolvedValueOnce({
            url: 'https://api.example.com/items/1',
            status: 200,
            statusText: 'OK',
            body: { id: 1, name: 'Item 1' }
        });
        const httpClientMock: HttpClient = {
            get: getMock
        };
        const assetsApiClient = new AssetsApiClient(httpClientMock);

        // When
        const result = await assetsApiClient.get<{ id: number; name: string }>('/items/1');

        // Then
        expect(getMock).toHaveBeenCalledExactlyOnceWith('/items/1', undefined);
        expect(result).toStrictEqual({ id: 1, name: 'Item 1' });
    });

    test('should get data from the specified path with abort signal', async () => {
        // Given
        const abortController = new AbortController();
        const getMock = vi.fn<HttpClient['get']>().mockResolvedValueOnce({
            url: 'https://api.example.com/items/2',
            status: 200,
            statusText: 'OK',
            body: { id: 2, name: 'Item 2' }
        });
        const httpClientMock: HttpClient = {
            get: getMock
        };
        const assetsApiClient = new AssetsApiClient(httpClientMock);

        // When
        const result = await assetsApiClient.get<{ id: number; name: string }>('/items/2', {
            abortSignal: abortController.signal
        });

        // Then
        expect(getMock).toHaveBeenCalledExactlyOnceWith('/items/2', {
            abortSignal: abortController.signal
        });
        expect(result).toStrictEqual({ id: 2, name: 'Item 2' });
    });
});
