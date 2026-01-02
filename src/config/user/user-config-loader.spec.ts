import { type AssetLoader } from '@lib/asset-loader/domain';
import { HttpUrl } from '@lib/http-client/domain';

import { UserConfigLoader } from './user-config-loader';

describe(UserConfigLoader, () => {
    test('should load valid user config', async () => {
        // Given
        const assetLoaderLoadMock = vi.fn<AssetLoader['load']>().mockImplementationOnce(
            async <T>(_path: string, validator: (data: unknown) => T): Promise<T> => validator({ vaultApiUrl: 'https://example.com/vault' })
        );
        const assetLoaderMock: AssetLoader = {
            load: assetLoaderLoadMock as AssetLoader['load']
        };
        const loader = new UserConfigLoader(assetLoaderMock);

        // When
        const config = await loader.load();

        // Then
        expect(config).toStrictEqual({
            vaultApiUrl: HttpUrl.create('https://example.com/vault')
        });
        expect(assetLoaderLoadMock).toHaveBeenCalledWith('/user-config.json', expect.any(Function));
        expect(assetLoaderLoadMock).toHaveBeenCalledTimes(1);
    });

    test('should throw error when user config structure is invalid', async () => {
        // Given
        const assetLoaderMock: AssetLoader = {
            load: vi.fn<AssetLoader['load']>().mockImplementation(
                async <T>(_path: string, validator: (data: unknown) => T): Promise<T> => validator({ invalidField: 'invalidValue' })
            ) as AssetLoader['load']
        };
        const loader = new UserConfigLoader(assetLoaderMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Invalid user config structure');
    });

    test('should propagate asset loader errors', async () => {
        // Given
        const assetLoaderMock: AssetLoader = {
            load: vi.fn<AssetLoader['load']>().mockRejectedValue(
                new Error('Failed to load asset from /user-config.json: Not Found')
            ) as AssetLoader['load']
        };
        const loader = new UserConfigLoader(assetLoaderMock);

        // When, Then
        await expect(loader.load()).rejects.toThrowError('Failed to load asset from /user-config.json: Not Found');
    });
});
