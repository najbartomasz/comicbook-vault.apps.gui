import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideAssetsHttpClient } from '@di/http-client/providers';
import { USER_CONFIG_TOKEN } from '@di/user-config/injection-tokens';
import { stubResponse } from '@testing/unit/http';

import { injectUserConfig } from './inject-functions';
import { provideUserConfig } from './providers/user-config.provider';

describe(injectUserConfig, () => {
    test('should initialize USER_CONFIG before app starts', async () => {
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
                provideAssetsHttpClient(),
                provideUserConfig()
            ]
        });
        await TestBed.inject(ApplicationInitStatus).donePromise;

        // When
        const appConfig = TestBed.runInInjectionContext(() => injectUserConfig());

        // Then
        expect(appConfig.vaultApiUrl.toString()).toBe('http://localhost:3000/vault');
    });

    test('should throw error when USER_CONFIG is accessed before initialization', async () => {
        // Given
        vi.spyOn(console, 'info').mockImplementation(vi.fn());
        TestBed.configureTestingModule({
            providers: [
                provideAssetsHttpClient(),
                provideUserConfig()
            ]
        });

        // When, Then
        expect(() => TestBed.inject(USER_CONFIG_TOKEN)).toThrowError(
            'USER_CONFIG_TOKEN is not initialized. Ensure the app initializer has completed before injecting USER_CONFIG_TOKEN.'
        );
    });
});
