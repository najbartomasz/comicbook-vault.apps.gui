import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { HttpMethod } from '../../method';

import { TimestampHttpInterceptor } from './timestamp.http-interceptor';

describe(TimestampHttpInterceptor, () => {
    test('should add timestamp to request metadata', () => {
        // Given
        const interceptor = new TimestampHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/resource',
            method: HttpMethod.Get
        };
        const now = 1234567890;
        vi.spyOn(Date, 'now').mockReturnValue(now);

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result).toStrictEqual({
            url: 'http://example.com/resource',
            method: HttpMethod.Get,
            metadata: {
                timestamp: now
            }
        });
    });

    test('should preserve existing metadata and add timestamp', () => {
        // Given
        const interceptor = new TimestampHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get
        };
        const now = 1234567890;
        vi.spyOn(Date, 'now').mockReturnValue(now);

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result.metadata).toStrictEqual({
            timestamp: now
        });
    });

    test('should override existing timestamp in request metadata', () => {
        // Given
        const interceptor = new TimestampHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                timestamp: 999
            }
        };
        const now = 1234567890;
        vi.spyOn(Date, 'now').mockReturnValue(now);

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result.metadata?.timestamp).toBe(now);
    });

    test('should add timestamp to response metadata', () => {
        // Given
        const interceptor = new TimestampHttpInterceptor();
        const responseStub: HttpResponse = {
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: { data: 'test' }
        };
        const now = 1234567890;
        vi.spyOn(Date, 'now').mockReturnValue(now);

        // When
        const result = interceptor.interceptResponse(responseStub);

        // Then
        expect(result).toStrictEqual({
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/resource',
            body: { data: 'test' },
            metadata: {
                timestamp: now
            }
        });
    });

    test('should override existing timestamp in response metadata', () => {
        // Given
        const interceptor = new TimestampHttpInterceptor();
        const responseStub: HttpResponse = {
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/api',
            body: {},
            metadata: {
                timestamp: 999
            }
        };
        const now = 1234567890;
        vi.spyOn(Date, 'now').mockReturnValue(now);

        // When
        const result = interceptor.interceptResponse(responseStub);

        // Then
        expect(result.metadata?.timestamp).toBe(now);
    });
});
