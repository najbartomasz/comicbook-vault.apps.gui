import { createAssetsRepository } from './assets-repository.factory';
import { HttpAssetsRepository } from './http-assets-repository';

describe(createAssetsRepository, () => {
    test('should create HttpAssetsRepository instance', () => {
        // Given, When
        const assetsApiClient = createAssetsRepository('https://api.example.com/assets');

        // Then
        expect(assetsApiClient).toBeInstanceOf(HttpAssetsRepository);
    });
});
