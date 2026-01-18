import { AssetsApiClient } from './assets-api-client';
import { createAssetsApiClient } from './assets-api-client.factory';

describe(createAssetsApiClient, () => {
    test('should create AssetsApiClient instance', () => {
        // Given, When
        const assetsApiClient = createAssetsApiClient('https://api.example.com/assets');

        // Then
        expect(assetsApiClient).toBeInstanceOf(AssetsApiClient);
    });
});
