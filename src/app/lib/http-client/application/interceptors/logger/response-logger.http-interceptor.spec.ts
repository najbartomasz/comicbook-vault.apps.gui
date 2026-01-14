import { HttpMethod, type HttpRequest, type HttpResponse } from '../../../domain';
import { type HttpInterceptorNext } from '../http-interceptor-next.type';

import { ResponseLoggerHttpInterceptor } from './response-logger.http-interceptor';

describe(ResponseLoggerHttpInterceptor, () => {
    test('should log response without metadata', async () => {
        // Given
        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
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
        const responseLoggerInterceptor = new ResponseLoggerHttpInterceptor();

        // When
        const result = await responseLoggerInterceptor.intercept(requestStub, nextMock);

        // Then
        expect(consoleInfoMock).toHaveBeenCalledExactlyOnceWith(
            '[HTTP Response] GET https://example.com/api 200',
            {
                body: { data: 'test' }
            }
        );
        expect(result).toBe(responseStub);
    });

    test('should log response with metadata', async () => {
        // Given
        const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(vi.fn());
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
        const responseLoggerInterceptor = new ResponseLoggerHttpInterceptor();

        // When
        const result = await responseLoggerInterceptor.intercept(requestStub, nextMock);

        // Then
        expect(consoleInfoMock).toHaveBeenCalledExactlyOnceWith(
            '[HTTP Response] GET https://example.com/api 200',
            {
                body: { data: 'test' },
                sequenceNumber: 42,
                timestamp: 1100,
                responseTimeMs: 100.25
            }
        );
        expect(result).toBe(responseStub);
    });
});
