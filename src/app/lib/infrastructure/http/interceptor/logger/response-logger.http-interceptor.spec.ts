import { type HttpInterceptorNext } from '../../http-interceptor-next.type';
import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { HttpMethod } from '../../method/http-method';

import { ResponseLoggerHttpInterceptor } from './response-logger.http-interceptor';

describe(ResponseLoggerHttpInterceptor, () => {
    test('should log response without metadata', async () => {
        // Given
        const consoleLogSpy = vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new ResponseLoggerHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get
        };
        const responseStub: HttpResponse = {
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' }
        };
        const nextMock = vi.fn<HttpInterceptorNext>().mockResolvedValueOnce(responseStub);

        // When
        const result = await interceptor.intercept(requestStub, nextMock);

        // Then
        expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('[HTTP Response]', {
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK'
        });
        expect(result).toBe(responseStub);
    });

    test('should log response with metadata', async () => {
        // Given
        const consoleLogSpy = vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new ResponseLoggerHttpInterceptor();
        const requestStub: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get,
            metadata: {
                sequenceNumber: 42,
                timestamp: 1000
            }
        };
        const responseStub: HttpResponse = {
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' },
            metadata: {
                sequenceNumber: 42,
                timestamp: 1100,
                responseTimeMs: 100.25
            }
        };
        const nextMock = vi.fn<HttpInterceptorNext>().mockResolvedValueOnce(responseStub);

        // When
        const result = await interceptor.intercept(requestStub, nextMock);

        // Then
        expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('[HTTP Response]', {
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            sequenceNumber: 42,
            timestamp: 1100,
            responseTimeMs: 100.25
        });
        expect(result).toBe(responseStub);
    });
});
