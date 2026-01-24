import { EndpointPath } from '@lib/generic/endpoint/domain';
import { type HttpClient, HttpPath } from '@lib/generic/http-client/domain';

import { HttpAssetsRepository } from './http-assets-repository';

describe(HttpAssetsRepository, () => {
    test('should get data from the specified path without abort signal', async () => {
        // Given
        const httpClientGetMock = vi.fn<HttpClient['get']>().mockResolvedValueOnce({
            url: 'https://api.example.com/items/1',
            status: 200,
            statusText: 'OK',
            body: { id: 1, name: 'Item 1' }
        });
        const httpClientMock: HttpClient = {
            get: httpClientGetMock
        };
        const assetsRepository = new HttpAssetsRepository(httpClientMock);

        // When
        const result = await assetsRepository.get<{ id: number; name: string }>(EndpointPath.create('/items/1'));

        // Then
        expect(httpClientGetMock).toHaveBeenCalledExactlyOnceWith(HttpPath.create('/items/1'), undefined);
        expect(result).toStrictEqual({ id: 1, name: 'Item 1' });
    });

    test('should get data from the specified path with abort signal', async () => {
        // Given
        const abortController = new AbortController();
        const httpClientGetMock = vi.fn<HttpClient['get']>().mockResolvedValueOnce({
            url: 'https://api.example.com/items/2',
            status: 200,
            statusText: 'OK',
            body: { id: 2, name: 'Item 2' }
        });
        const httpClientMock: HttpClient = {
            get: httpClientGetMock
        };
        const assetsRepository = new HttpAssetsRepository(httpClientMock);

        // When
        const result = await assetsRepository.get<{ id: number; name: string }>(EndpointPath.create('/items/2'), {
            abortSignal: abortController.signal
        });

        // Then
        expect(httpClientGetMock).toHaveBeenCalledExactlyOnceWith(HttpPath.create('/items/2'), {
            abortSignal: abortController.signal
        });
        expect(result).toStrictEqual({ id: 2, name: 'Item 2' });
    });
});
