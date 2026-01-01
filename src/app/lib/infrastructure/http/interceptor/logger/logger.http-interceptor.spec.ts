import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { HttpMethod } from '../../method';

import { LoggerHttpInterceptor } from './logger.http-interceptor';

describe(LoggerHttpInterceptor, () => {
    test('should log request without sequence number when metadata is not present', () => {
        // Given
        const consoleLogSpy = vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new LoggerHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('[HTTP Request]', {
            method: HttpMethod.Get,
            url: 'http://example.com/api'
        });
        expect(result).toBe(requestStub);
    });

    test('should log request with sequence number when metadata is present', () => {
        // Given
        const consoleLogSpy = vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new LoggerHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('[HTTP Request]', {
            method: HttpMethod.Get,
            url: 'http://example.com/api'
        });
        expect(result).toBe(requestStub);
    });

    test('should preserve existing request metadata', () => {
        // Given
        vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new LoggerHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 42,
                timestamp: 1234567890,
                highResolutionTimestamp: 78343.570643
            }
        };

        // When
        const result = interceptor.interceptRequest(requestStub);

        // Then
        expect(result).toBe(requestStub);
        expect(result.metadata).toStrictEqual({
            sequenceNumber: 42,
            timestamp: 1234567890,
            highResolutionTimestamp: 78343.570643
        });
    });

    test('should log response without sequence number when metadata is not present', () => {
        // Given
        const consoleLogSpy = vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new LoggerHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get
        };
        const responseStub: HttpResponse = {
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/api',
            body: { data: 'test' }
        };

        // When
        const result = interceptor.interceptResponse(responseStub, requestStub);

        // Then
        expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('[HTTP Response]', {
            url: 'http://example.com/api',
            status: 200,
            statusText: 'OK'
        });
        expect(result).toBe(responseStub);
    });

    test('should log response with sequence number when metadata is present', () => {
        // Given
        const consoleLogSpy = vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new LoggerHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 42
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
        expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('[HTTP Response]', {
            url: 'http://example.com/api',
            status: 200,
            statusText: 'OK',
            sequenceNumber: 42
        });
        expect(result).toBe(responseStub);
    });

    test('should preserve existing response metadata', () => {
        // Given
        vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new LoggerHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'http://example.com/api',
            method: HttpMethod.Get
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
        expect(result).toBe(responseStub);
        expect(result.metadata).toStrictEqual({
            timestamp: 1234567890
        });
    });
});
