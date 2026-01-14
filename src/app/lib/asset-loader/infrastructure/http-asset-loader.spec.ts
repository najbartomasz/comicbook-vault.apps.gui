import { type HttpClient } from '@lib/http-client/domain';

import { HttpAssetLoader } from './http-asset-loader';

describe(HttpAssetLoader, () => {
    test('should load asset', async () => {
        // Given
        interface UserConfigAsset {
            readonly serverUrl: string;
        }
        const httpGetMock = vi.fn<HttpClient['get']>().mockResolvedValueOnce({
            url: 'https://localhost:4200/assets/user-config.json',
            status: 200,
            statusText: 'OK',
            body: { serverUrl: 'https://example.com/api' }
        });
        const httpClientMock: HttpClient = {
            get: httpGetMock
        };
        const assetLoader = new HttpAssetLoader(httpClientMock);

        // When
        const asset = await assetLoader.load<UserConfigAsset>('/assets/user-config.json', (data) => data as UserConfigAsset);

        // Then
        expect(asset).toStrictEqual({ serverUrl: 'https://example.com/api' });
        expect(httpGetMock).toHaveBeenCalledExactlyOnceWith('/assets/user-config.json');
    });

    test('should throw error when response status is not OK', async () => {
        // Given
        interface IconsAsset {
            readonly icons: SVGElement[];
        }
        const httpClientMock: HttpClient = {
            get: vi.fn<HttpClient['get']>().mockResolvedValueOnce({
                url: 'https://localhost:4200/assets/icons.json',
                status: 404,
                statusText: 'Not Found',
                body: {}
            })
        };
        const loader = new HttpAssetLoader(httpClientMock);

        // When, Then
        await expect(loader.load<IconsAsset>('/assets/icons.json', (data) => data as IconsAsset)).rejects.toThrowError(
            'Failed to load asset from /assets/icons.json: Not Found'
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
