import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { stubResponse } from '@testing/unit/http';

import { injectAssetsHttpClient } from './inject-functions/assets-http-client.inject-function';
import { provideAssetsHttpClient } from './providers';

describe(injectAssetsHttpClient, () => {
    test('should send GET request, receive expected response and log to console', async () => {
        // Given
        TestBed.configureTestingModule({
            providers: [
                { provide: PLATFORM_ID, useValue: 'browser' },
                provideAssetsHttpClient()
            ]
        });

        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
        vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(
            stubResponse({
                url: 'https://app.com/assets/config.json',
                body: { message: 'Hello, World!' },
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        ));

        const httpClient = TestBed.runInInjectionContext(() => injectAssetsHttpClient());

        // When
        const response = await httpClient.get('/assets/config.json');

        // Then
        expect(response).toStrictEqual({
            url: expect.stringContaining('/assets/config.json'),
            status: 200,
            statusText: 'OK',
            metadata: {
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            },
            body: { message: 'Hello, World!' }
        });
        expect(consoleInfoMock).toHaveBeenCalledWith(
            `[HTTP Request] GET ${globalThis.location.origin}/assets/config.json`,
            {
                sequenceNumber: 1,
                timestamp: expect.any(Number)
            }
        );
        expect(consoleInfoMock).toHaveBeenNthCalledWith(
            2,
            `[HTTP Response] GET ${globalThis.location.origin}/assets/config.json 200`,
            {
                body: { message: 'Hello, World!' },
                sequenceNumber: 1,
                timestamp: expect.any(Number),
                responseTimeMs: expect.any(Number)
            }
        );
    });

    test('should throw error when injected on server platform', () => {
        // Given
        TestBed.configureTestingModule({
            providers: [
                { provide: PLATFORM_ID, useValue: 'server' },
                provideAssetsHttpClient()
            ]
        });

        // When, Then
        expect(() => {
            TestBed.runInInjectionContext(() => injectAssetsHttpClient());
        }).toThrowError('AssetsHttpClient is not available on server. Use direct file system access instead.');
    });
});
