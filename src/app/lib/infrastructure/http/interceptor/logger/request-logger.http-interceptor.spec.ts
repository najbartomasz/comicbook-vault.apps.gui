import { type HttpInterceptorNext } from '../../http-interceptor-next.type';
import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { HttpMethod } from '../../method/http-method';

import { RequestLoggerHttpInterceptor } from './request-logger.http-interceptor';

describe(RequestLoggerHttpInterceptor, () => {
    test('should log request without metadata', async () => {
        // Given
        const consoleLogSpy = vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new RequestLoggerHttpInterceptor();
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
        expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('[HTTP Request]', {
            url: 'https://example.com/api',
            method: HttpMethod.Get
        });
        expect(result).toBe(responseStub);
    });

    test('should log request with metadata', async () => {
        // Given
        const consoleLogSpy = vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new RequestLoggerHttpInterceptor();
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

        // When
        const result = await interceptor.intercept(requestStub, nextMock);

        // Then
        expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('[HTTP Request]', {
            method: HttpMethod.Get,
            url: 'https://example.com/api',
            sequenceNumber: 42,
            timestamp: 1000
        });
        expect(result).toBe(responseStub);
    });
});
