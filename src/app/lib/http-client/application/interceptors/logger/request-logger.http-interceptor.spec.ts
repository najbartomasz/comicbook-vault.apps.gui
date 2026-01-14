import { HttpMethod, type HttpRequest, type HttpResponse } from '../../../domain';
import { type HttpInterceptorNext } from '../http-interceptor-next.type';

import { RequestLoggerHttpInterceptor } from './request-logger.http-interceptor';

describe(RequestLoggerHttpInterceptor, () => {
    test('should log request without metadata', async () => {
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
        const requestLoggerInterceptor = new RequestLoggerHttpInterceptor();

        // When
        const result = await requestLoggerInterceptor.intercept(requestStub, nextMock);

        // Then
        expect(consoleInfoMock).toHaveBeenCalledExactlyOnceWith(
            '[HTTP Request] GET https://example.com/api',
            {}
        );
        expect(result).toBe(responseStub);
    });

    test('should log request with metadata', async () => {
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
            body: { data: 'test' }
        };
        const nextMock = vi.fn<HttpInterceptorNext>().mockResolvedValueOnce(responseStub);
        const requestLoggerInterceptor = new RequestLoggerHttpInterceptor();

        // When
        const result = await requestLoggerInterceptor.intercept(requestStub, nextMock);

        // Then
        expect(consoleInfoMock).toHaveBeenCalledExactlyOnceWith(
            '[HTTP Request] GET https://example.com/api',
            {
                sequenceNumber: 42,
                timestamp: 1000
            }
        );
        expect(result).toBe(responseStub);
    });
});
