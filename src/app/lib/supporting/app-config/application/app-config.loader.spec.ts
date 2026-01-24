import { EndpointPath } from '@lib/generic/endpoint/domain';
import { type AssetsRepository } from '@lib/supporting/assets-api-client/domain';

import { AppConfig } from '../domain';

import { AppConfigLoader } from './app-config.loader';

describe(AppConfigLoader, () => {
    test('should load valid app config', async () => {
        // Given
        const assetsRepositoryGetMock = vi.fn<AssetsRepository['get']>().mockResolvedValueOnce({
            vaultApiUrl: 'https://api.example.com/vault'
        }) as AssetsRepository['get'];
        const assetsRepositoryMock: AssetsRepository = {
            get: assetsRepositoryGetMock
        };
        const loader = new AppConfigLoader(assetsRepositoryMock);

        // When
        const config = await loader.load();

        // Then
        expect(assetsRepositoryGetMock).toHaveBeenCalledExactlyOnceWith(EndpointPath.create('/app-config.json'));
        expect(config).toStrictEqual(AppConfig.create({
            vaultApiUrl: 'https://api.example.com/vault'
        }));
        expect(config.vaultApiUrl.toString()).toBe('https://api.example.com/vault');
    });

    test('should throw error when app config format is invalid', async () => {
        // Given
        const assetsRepositoryMock: AssetsRepository = {
            get: vi.fn<AssetsRepository['get']>().mockResolvedValueOnce('config') as AssetsRepository['get']
        };
        const loader = new AppConfigLoader(assetsRepositoryMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
    });

    test('should throw error when app config is empty', async () => {
        // Given
        const assetsRepositoryMock: AssetsRepository = {
            get: vi.fn<AssetsRepository['get']>().mockResolvedValueOnce(null) as AssetsRepository['get']
        };
        const loader = new AppConfigLoader(assetsRepositoryMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
    });

    test('should throw error if vaultApiUrl is missing', async () => {
        // Given
        const assetsRepositoryMock: AssetsRepository = {
            get: vi.fn<AssetsRepository['get']>().mockResolvedValueOnce({ someOtherKey: 'value' }) as AssetsRepository['get']
        };
        const loader = new AppConfigLoader(assetsRepositoryMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
    });

    test('should throw error if vaultApiUrl is not a string', async () => {
        // Given
        const assetsRepositoryMock: AssetsRepository = {
            get: vi.fn<AssetsRepository['get']>().mockResolvedValueOnce({ vaultApiUrl: 12345 }) as AssetsRepository['get']
        };
        const loader = new AppConfigLoader(assetsRepositoryMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid app config format');
    });
});
