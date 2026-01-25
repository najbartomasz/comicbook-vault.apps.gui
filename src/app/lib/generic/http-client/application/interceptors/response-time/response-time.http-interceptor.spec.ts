import { HighResolutionTimestamp, type HighResolutionTimestampProvider } from '@lib/generic/performance/domain';

import { type HttpInterceptorNext, HttpMethod, type HttpRequest, type HttpResponse } from '../../../domain';

import { ResponseTimeHttpInterceptor } from './response-time.http-interceptor';

describe(ResponseTimeHttpInterceptor, () => {
    test('should calculate response time', async () => {
        // Given
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
        vi.spyOn(performance, 'now')
            .mockReturnValueOnce(1000)
            .mockReturnValueOnce(1100.25);
        const highResolutionTimestampProviderStub = {
            now: vi.fn<HighResolutionTimestampProvider['now']>()
                .mockReturnValueOnce(HighResolutionTimestamp.create(1000))
                .mockReturnValueOnce(HighResolutionTimestamp.create(1100.25))
        };
        const responseTimeInterceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);

        // When
        const result = await responseTimeInterceptor.intercept(requestStub, nextMock);

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
        vi.spyOn(performance, 'now')
            .mockReturnValueOnce(1000)
            .mockReturnValueOnce(1100.25);
        const highResolutionTimestampProviderStub = {
            now: vi.fn<HighResolutionTimestampProvider['now']>()
                .mockReturnValueOnce(HighResolutionTimestamp.create(1000))
                .mockReturnValueOnce(HighResolutionTimestamp.create(1100.25))
        };
        const responseTimeInterceptor = new ResponseTimeHttpInterceptor(highResolutionTimestampProviderStub);

        // When
        const result = await responseTimeInterceptor.intercept(requestStub, nextMock);

        // Then
        expect(result.metadata).toStrictEqual({
            timestamp: 1100,
            responseTimeMs: 100.25
        });
    });
});
