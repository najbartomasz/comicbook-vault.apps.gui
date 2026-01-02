import { type HighResolutionTimestampProvider } from '@lib/performance/domain';

import { HttpMethod, type HttpRequest, type HttpResponse } from '../../../domain';
import { type HttpInterceptorNext } from '../http-interceptor-next.type';

import { ResponseTimeHttpInterceptor } from './response-time.http-interceptor';

describe(ResponseTimeHttpInterceptor, () => {
    test('should calculate response time', async () => {
        // Given
        const highResolutionTimestampProviderStub = {
            now: vi.fn<HighResolutionTimestampProvider['now']>()
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(1100.25)
        };
        const interceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);
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
        expect(result).toStrictEqual({
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' },
            metadata: {
                responseTimeMs: 100.25
            }
        });
    });

    test('should preserve existing response metadata while adding response time', async () => {
        // Given
        const highResolutionTimestampProviderStub = {
            now: vi.fn<HighResolutionTimestampProvider['now']>()
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(1100.25)
        };
        const interceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);
        const requestStub: HttpRequest = {
            url: 'https://example.com/api',
            method: HttpMethod.Get
        };
        const responseStub: HttpResponse = {
            url: 'https://example.com/api',
            status: 200,
            statusText: 'OK',
            body: { data: 'test' },
            metadata: {
                timestamp: 1100
            }
        };
        const nextMock = vi.fn<HttpInterceptorNext>().mockResolvedValueOnce(responseStub);

        // When
        const result = await interceptor.intercept(requestStub, nextMock);

        // Then
        expect(result.metadata).toStrictEqual({
            timestamp: 1100,
            responseTimeMs: 100.25
        });
    });
});
