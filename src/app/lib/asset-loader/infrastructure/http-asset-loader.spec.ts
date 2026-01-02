import { type HttpClient } from '@lib/http-client/domain';

import { HttpAssetLoader } from './http-asset-loader';

describe(HttpAssetLoader, () => {
    test('should load asset', async () => {
        // Given
        interface MessageAsset {
            readonly message: string;
        }
        const httpGetMock = vi.fn<HttpClient['get']>().mockResolvedValueOnce({
            url: 'https://localhost:4200/assets/test.json',
            status: 200,
            statusText: 'OK',
            body: { message: 'Hello, World!' }
        });
        const httpClientMock: HttpClient = {
            get: httpGetMock
        };
        const assetLoader = new HttpAssetLoader(httpClientMock);

        // When
        const asset = await assetLoader.load<MessageAsset>('/assets/test.json', (data) => data as MessageAsset);

        // Then
        expect(asset).toStrictEqual({ message: 'Hello, World!' });
        expect(httpGetMock).toHaveBeenCalledExactlyOnceWith('/assets/test.json');
    });

    test('should throw error when response status is not OK', async () => {
        // Given
        interface IconAsset {
            readonly img: SVGElement;
        }
        const httpClientMock: HttpClient = {
            get: vi.fn<HttpClient['get']>().mockResolvedValueOnce({
                url: 'https://localhost:4200/assets/test.json',
                status: 404,
                statusText: 'Not Found',
                body: {}
            })
        };
        const loader = new HttpAssetLoader(httpClientMock);

        // When, Then
        await expect(loader.load<IconAsset>('/assets/test.json', (data) => data as IconAsset)).rejects.toThrowError(
            'Failed to load asset from /assets/test.json: Not Found'
        );
    });

    test('should throw error when validator fails', async () => {
        // Given
        const httpClientMock: HttpClient = {
            get: vi.fn<HttpClient['get']>().mockResolvedValueOnce({
                url: 'https://localhost:4200/config.json',
                status: 200,
                statusText: 'OK',
                body: { invalid: 'data' }
            })
        };
        const loader = new HttpAssetLoader(httpClientMock);

        // When, Then
        await expect(
            loader.load('/config.json', () => {
                throw new Error('Invalid config structure');
            })
        ).rejects.toThrowError('Invalid config structure');
    });
});
