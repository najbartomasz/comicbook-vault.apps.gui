import { type HttpClient } from '@lib/http-client/domain';
import { HttpAssetsRepository } from 'src/app/api/assets/infrastructure/http-assets-repository';

import { AppConfig } from '../domain';

import { AppConfigLoader } from './app-config.loader';

describe(AppConfigLoader, () => {
    test('should load valid app config', async () => {
        // Given
        const httpClientGetMock = vi.fn<HttpClient['get']>().mockResolvedValueOnce({
            url: 'https://example.com/app-config.json',
            status: 200,
            statusText: 'OK',
            body: {
                vaultApiUrl: 'https://api.example.com/vault'
            }
        });
        const httpClientMock: HttpClient = {
            get: httpClientGetMock
        };
        const loader = new AppConfigLoader(new HttpAssetsRepository(httpClientMock));

        // When
        const config = await loader.load();

        // Then
        expect(httpClientGetMock).toHaveBeenCalledExactlyOnceWith('/app-config.json', undefined);
        expect(config).toStrictEqual(AppConfig.create({
            vaultApiUrl: 'https://api.example.com/vault'
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
        const assetsRepository = new HttpAssetsRepository(httpClientMock);
        const loader = new AppConfigLoader(assetsRepository);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
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
        const assetsRepository = new HttpAssetsRepository(httpClientMock);
        const loader = new AppConfigLoader(assetsRepository);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
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
        const assetsRepository = new HttpAssetsRepository(httpClientMock);
        const loader = new AppConfigLoader(assetsRepository);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
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
        const assetsRepository = new HttpAssetsRepository(httpClientMock);
        const loader = new AppConfigLoader(assetsRepository);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
    });
});
