import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppConfig } from '@lib/supporting/app-config/domain';
import { stubResponse } from '@testing/unit/http';

import { provideAssetsApiClient } from '../assets-api-client/assets-api-client.provider';

import { provideAppConfig } from './app-config.provider';

describe(provideAppConfig, () => {
    test('should provide AppConfig after initialization', async () => {
        // Given
        vi.spyOn(console, 'info').mockImplementation(vi.fn());
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'http://localhost:4200/assets/app-config.json',
                body: { vaultApiUrl: 'http://localhost:3000/vault' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));
        TestBed.configureTestingModule({
            providers: [
                provideAssetsApiClient(),
                provideAppConfig()
            ]
        });
        await TestBed.inject(ApplicationInitStatus).donePromise;

        // When
        const appConfig = TestBed.inject(AppConfig);

        // Then
        expect(appConfig.vaultApiUrl.toString()).toBe('http://localhost:3000/vault');
    });

    test('should throw error when AppConfig is accessed before initialization', async () => {
        // Given
        vi.spyOn(console, 'info').mockImplementation(vi.fn());
        TestBed.configureTestingModule({
            providers: [
                provideAssetsApiClient(),
                provideAppConfig()
            ]
        });

        // When, Then
        expect(() => TestBed.inject(AppConfig)).toThrowError(
            'AppConfig is not initialized. Ensure the app initializer has completed before injecting AppConfig.'
        );
    });
});
