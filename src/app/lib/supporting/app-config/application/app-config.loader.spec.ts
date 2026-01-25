import { EndpointPath } from '@lib/generic/endpoint/domain';
import { type AssetsApiClient } from '@lib/supporting/assets-api-client/domain';

import { AppConfig } from '../domain';

import { AppConfigLoader } from './app-config.loader';

describe(AppConfigLoader, () => {
    test('should load valid app config', async () => {
        // Given
        const assetsApiClientGetMock = vi.fn<AssetsApiClient['get']>().mockResolvedValueOnce({
            vaultApiUrl: 'https://api.example.com/vault'
        }) as AssetsApiClient['get'];
        const assetsApiClientMock: AssetsApiClient = {
            get: assetsApiClientGetMock
        };
        const loader = new AppConfigLoader(assetsApiClientMock);

        // When
        const config = await loader.load();

        // Then
        expect(assetsApiClientGetMock).toHaveBeenCalledExactlyOnceWith(EndpointPath.create('/app-config.json'));
        expect(config).toStrictEqual(AppConfig.create({
            vaultApiUrl: 'https://api.example.com/vault'
        }));
        expect(config.vaultApiUrl.toString()).toBe('https://api.example.com/vault');
    });

    test('should throw error when app config format is invalid', async () => {
        // Given
        const assetsApiClientMock: AssetsApiClient = {
            get: vi.fn<AssetsApiClient['get']>().mockResolvedValueOnce('config') as AssetsApiClient['get']
        };
        const loader = new AppConfigLoader(assetsApiClientMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
    });

    test('should throw error when app config is empty', async () => {
        // Given
        const assetsApiClientMock: AssetsApiClient = {
            get: vi.fn<AssetsApiClient['get']>().mockResolvedValueOnce(null) as AssetsApiClient['get']
        };
        const loader = new AppConfigLoader(assetsApiClientMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
    });

    test('should throw error if vaultApiUrl is missing', async () => {
        // Given
        const assetsApiClientMock: AssetsApiClient = {
            get: vi.fn<AssetsApiClient['get']>().mockResolvedValueOnce({ someOtherKey: 'value' }) as AssetsApiClient['get']
        };
        const loader = new AppConfigLoader(assetsApiClientMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
    });

    test('should throw error if vaultApiUrl is not a string', async () => {
        // Given
        const assetsApiClientMock: AssetsApiClient = {
            get: vi.fn<AssetsApiClient['get']>().mockResolvedValueOnce({ vaultApiUrl: 12345 }) as AssetsApiClient['get']
        };
        const loader = new AppConfigLoader(assetsApiClientMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
    });
});
