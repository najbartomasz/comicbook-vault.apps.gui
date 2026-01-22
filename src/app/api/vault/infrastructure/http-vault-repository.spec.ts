import { type HttpClient, HttpPath } from '@lib/http-client/domain';

import { HttpVaultRepository } from './http-vault-repository';

describe(HttpVaultRepository, () => {
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
        const vaultRepository = new HttpVaultRepository(httpClientMock);

        // When
        const result = await vaultRepository.get<{ id: number; name: string }>(HttpPath.create('/items/1'));

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
        const vaultRepository = new HttpVaultRepository(httpClientMock);

        // When
        const result = await vaultRepository.get<{ id: number; name: string }>(HttpPath.create('/items/2'), {
            abortSignal: abortController.signal
        });

        // Then
        expect(getMock).toHaveBeenCalledExactlyOnceWith('/items/2', {
            abortSignal: abortController.signal
        });
        expect(result).toStrictEqual({ id: 2, name: 'Item 2' });
    });
});
