import { createAssetsApiClient } from './assets-api-client.factory';
import { HttpAssetsApiClient } from './http-assets-api-client';

describe(createAssetsApiClient, () => {
    test('should create HttpAssetsApiClient instance', () => {
        // Given, When
        const assetsApiClient = createAssetsApiClient('https://api.example.com/assets');

        // Then
        expect(assetsApiClient).toBeInstanceOf(HttpAssetsApiClient);
    });
});
