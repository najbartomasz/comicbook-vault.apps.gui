import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AssetsRepository } from '@api/assets/domain';

import { provideAssetsApiClient } from './assets-repository.provider';

describe(provideAssetsApiClient, () => {
    test('should provide AssetsRepository', () => {
        // Given
        TestBed.configureTestingModule({
            providers: [
                { provide: PLATFORM_ID, useValue: 'browser' },
                provideAssetsApiClient()
            ]
        });

        // When, Then
        expect(TestBed.inject(AssetsRepository)).toBeInstanceOf(AssetsRepository);
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
        expect(() => TestBed.inject(AssetsRepository)).toThrowError(
            'AssetsHttpClient is not available on server. Use direct file system access instead.'
        );
    });
});
