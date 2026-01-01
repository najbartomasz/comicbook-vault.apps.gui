import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { HttpMethod } from '../../method';

import { ResponseTimeHttpInterceptor } from './response-time.http.interceptor';

describe(ResponseTimeHttpInterceptor, () => {
    test('should add high resolution timestamp to request metadata', () => {
        // Given
        const highResolutionTimestampProviderStub = {
            now: () => 78343.570643
        };
        const interceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result).toStrictEqual({
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                highResolutionTimestamp: 78343.570643
            }
        });
    });

    test('should override existing high resolution timestamp in request metadata', () => {
        // Given
        const highResolutionTimestampProviderStub = {
            now: () => 78343.570643
        };
        const interceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                highResolutionTimestamp: 1000
            }
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result.metadata?.highResolutionTimestamp).toBe(78343.570643);
    });

    test('should preserve existing metadata while adding high resolution timestamp to request', () => {
        // Given
        const highResolutionTimestampProviderStub = {
            now: () => 78343.570643
        };
        const interceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 42,
                timestamp: 1234567890
            }
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result).toStrictEqual({
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 42,
                timestamp: 1234567890,
                highResolutionTimestamp: 78343.570643
            }
        });
    });

    test('should add response time to response metadata', () => {
        // Given
        const highResolutionTimestampProviderStub = {
            now: () => 1150.256
        };
        const interceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                highResolutionTimestamp: 1000
            }
        };
        const responseStub: HttpResponse = {
            url: 'http://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' }
        };

        // When
        const result = interceptor.interceptResponse(responseStub, requestStub);

        // Then
        expect(result).toStrictEqual({
            url: 'http://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' },
            metadata: {
                responseTimeMs: 150.26
            }
        });
    });

    test('should set request high resolution timestamp to 0 ms when it is missing in request metadata', () => {
        // Given
        const highResolutionTimestampProviderStub = {
            now: () => 1150.256
        };
        const interceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get
        };
        const responseStub: HttpResponse = {
            url: 'http://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' }
        };

        // When
        const result = interceptor.interceptResponse(responseStub, requestStub);

        // Then
        expect(result).toStrictEqual({
            url: 'http://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' },
            metadata: {
                responseTimeMs: 1150.26
            }
        });
    });

    test('should preserve existing metadata while adding response time to response', () => {
        // Given
        const highResolutionTimestampProviderStub = {
            now: () => 2000.5
        };
        const interceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                highResolutionTimestamp: 1800.25
            }
        };
        const responseStub: HttpResponse = {
            url: 'http://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' },
            metadata: {
                timestamp: 1234567890
            }
        };

        // When
        const result = interceptor.interceptResponse(responseStub, requestStub);

        // Then
        expect(result).toStrictEqual({
            url: 'http://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' },
            metadata: {
                timestamp: 1234567890,
                responseTimeMs: 200.25
            }
        });
    });
});
