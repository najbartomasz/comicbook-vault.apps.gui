import { type CurrentDateTimeProvider } from '@lib/core/date-time';

import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { HttpMethod } from '../../method';

import { TimestampHttpInterceptor } from './timestamp.http-interceptor';

describe(TimestampHttpInterceptor, () => {
    test('should add timestamp to request metadata', () => {
        // Given
        const dateTimeProviderStub: CurrentDateTimeProvider = {
            now: () => 1234567890
        };
        const interceptor = new TimestampHttpInterceptor(dateTimeProviderStub);
        const requestStub: HttpRequest = {
            url: 'http://example.com/resource',
            method: HttpMethod.Get
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result).toStrictEqual({
            url: 'http://example.com/resource',
            method: HttpMethod.Get,
            metadata: {
                timestamp: 1234567890
            }
        });
    });

    test('should preserve existing metadata and add timestamp', () => {
        // Given
        const dateTimeProviderStub: CurrentDateTimeProvider = {
            now: () => 1234567890
        };
        const interceptor = new TimestampHttpInterceptor(dateTimeProviderStub);
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result.metadata).toStrictEqual({
            timestamp: 1234567890
        });
    });

    test('should override existing timestamp in request metadata', () => {
        // Given
        const dateTimeProviderStub: CurrentDateTimeProvider = {
            now: () => 1234567890
        };
        const interceptor = new TimestampHttpInterceptor(dateTimeProviderStub);
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                timestamp: 999
            }
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result.metadata?.timestamp).toBe(1234567890);
    });

    test('should add timestamp to response metadata', () => {
        // Given
        const dateTimeProviderStub: CurrentDateTimeProvider = {
            now: () => 1234567890
        };
        const interceptor = new TimestampHttpInterceptor(dateTimeProviderStub);
        const responseStub: HttpResponse = {
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: { data: 'test' }
        };

        // When
        const result = interceptor.interceptResponse(responseStub);

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: { data: 'test' },
            metadata: {
                timestamp: 1234567890
            }
        });
    });

    test('should override existing timestamp in response metadata', () => {
        // Given
        const dateTimeProviderStub: CurrentDateTimeProvider = {
            now: () => 1234567890
        };
        const interceptor = new TimestampHttpInterceptor(dateTimeProviderStub);
        const responseStub: HttpResponse = {
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/api',
            body: {},
            metadata: {
                timestamp: 999
            }
        };

        // When
        const result = interceptor.interceptResponse(responseStub);

        // Then
        expect(result.metadata?.timestamp).toBe(1234567890);
    });
});
