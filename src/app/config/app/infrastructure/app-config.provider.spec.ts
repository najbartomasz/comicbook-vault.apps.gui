import { type HttpClient } from '@lib/http-client/domain';
import { AssetsApiClient } from 'src/app/api/assets/infrastructure/assets-api-client';
import { HttpUrl } from 'src/app/lib/http-client/domain/http-url';

import { AppConfig } from '../domain';

import { AppConfigProvider } from './app-config.provider';

describe(AppConfigProvider, () => {
    test('should load valid app config', async () => {
        // Given
        const httpClientMock: HttpClient = {
            get: vi.fn<HttpClient['get']>().mockResolvedValueOnce({
                url: 'https://example.com/app-config.json',
                status: 200,
                statusText: 'OK',
                body: {
                    vaultApiUrl: 'https://api.example.com/vault'
                }
            })
        };
        const assetsApiClient = new AssetsApiClient(httpClientMock);
        const assetsApiClientGetSpy = vi.spyOn(assetsApiClient, 'get');
        const provider = new AppConfigProvider(assetsApiClient);

        // When
        const config = await provider.getConfig();

        // Then
        expect(assetsApiClientGetSpy).toHaveBeenCalledExactlyOnceWith('/app-config.json');
        expect(config).toStrictEqual(AppConfig.create({
            vaultApiUrl: HttpUrl.create('https://api.example.com/vault')
        }));
        expect(config.vaultApiUrl.toString()).toBe('https://api.example.com/vault');
    });

    test('should throw error when app config format is invalid', async () => {
        // Given
        const httpClientMock: HttpClient = {
            get: vi.fn<HttpClient['get']>().mockResolvedValueOnce({
                url: 'https://example.com/app-config.json',
                status: 200,
                statusText: 'OK',
                body: 'config'
            })
        };
        const assetsApiClient = new AssetsApiClient(httpClientMock);
        const loader = new AppConfigProvider(assetsApiClient);

        // When, Then
        await expect(loader.getConfig()).rejects.toThrowError('Invalid app config format');
    });

    test('should throw error when app config is empty', async () => {
        // Given
        const httpClientMock: HttpClient = {
            get: vi.fn<HttpClient['get']>().mockResolvedValueOnce({
                url: 'https://example.com/app-config.json',
                status: 200,
                statusText: 'OK',
                body: null
            })
        };
        const assetsApiClient = new AssetsApiClient(httpClientMock);
        const provider = new AppConfigProvider(assetsApiClient);

        // When, Then
        await expect(provider.getConfig()).rejects.toThrowError('Invalid app config format');
    });

    test('should throw error if vaultApiUrl is missing', async () => {
        // Given
        const httpClientMock: HttpClient = {
            get: vi.fn<HttpClient['get']>().mockResolvedValueOnce({
                url: 'https://example.com/app-config.json',
                status: 200,
                statusText: 'OK',
                body: { someOtherKey: 'value' }
            })
        };
        const assetsApiClient = new AssetsApiClient(httpClientMock);
        const provider = new AppConfigProvider(assetsApiClient);

        // When, Then
        await expect(provider.getConfig()).rejects.toThrowError('Invalid app config format');
    });

    test('should throw error if vaultApiUrl is not a string', async () => {
        // Given
        const httpClientMock: HttpClient = {
            get: vi.fn<HttpClient['get']>().mockResolvedValueOnce({
                url: 'https://example.com/app-config.json',
                status: 200,
                statusText: 'OK',
                body: { vaultApiUrl: 12345 }
            })
        };
        const assetsApiClient = new AssetsApiClient(httpClientMock);
        const provider = new AppConfigProvider(assetsApiClient);

        // When, Then
        await expect(provider.getConfig()).rejects.toThrowError('Invalid app config format');
    });
});
