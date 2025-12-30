import { type HttpRequest } from '../../http-request.interface';
import { type HttpResponse } from '../../http-response.interface';
import { HttpMethod } from '../../method';

import { LoggerHttpInterceptor } from './logger.http-interceptor';

describe(LoggerHttpInterceptor, () => {
    test('should log request and return unchanged request', () => {
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

    test('should log response and return unchanged response', () => {
        // Given
        const consoleLogSpy = vi.spyOn(console, 'info').mockImplementationOnce(vi.fn());
        const interceptor = new LoggerHttpInterceptor();
        const responseStub: HttpResponse = {
            status: 200,
            statusText: 'OK',
            url: 'http://example.com/api',
            body: { data: 'test' }
        };

        // When
        const result = interceptor.interceptResponse(responseStub);

        // Then
        expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('[HTTP Response]', {
            url: 'http://example.com/api',
            status: 200,
            statusText: 'OK'
        });
        expect(result).toBe(responseStub);
    });
});
