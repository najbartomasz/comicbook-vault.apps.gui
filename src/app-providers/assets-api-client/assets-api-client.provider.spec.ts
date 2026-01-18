import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AssetsApiClient } from '@api/assets/infrastructure';

import { provideAssetsApiClient } from './assets-api-client.provider';

describe(provideAssetsApiClient, () => {
    test('should provide AssetsApiClient', () => {
        // Given
        TestBed.configureTestingModule({
            providers: [
                { provide: PLATFORM_ID, useValue: 'browser' },
                provideAssetsApiClient()
            ]
        });

        // When, Then
        expect(TestBed.inject(AssetsApiClient)).toBeInstanceOf(AssetsApiClient);
    });

    test('should throw error when not in browser platform', () => {
        // Given
        TestBed.configureTestingModule({
            providers: [
                { provide: PLATFORM_ID, useValue: 'server' },
                provideAssetsApiClient()
            ]
        });

        // When, Then
        expect(() => TestBed.inject(AssetsApiClient)).toThrowError(
            'AssetsHttpClient is not available on server. Use direct file system access instead.'
        );
    });
});
